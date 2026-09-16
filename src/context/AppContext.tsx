import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Profile, 
  Trip, 
  DeliveryRequest, 
  Booking, 
  BookingStatus, 
  AppNotification, 
  Rating, 
  UserRole 
} from '../types';
import { 
  MOCK_DRIVERS, 
  MOCK_CUSTOMERS, 
  MOCK_TRIPS, 
  MOCK_REQUESTS, 
  MOCK_BOOKINGS, 
  MOCK_NOTIFICATIONS 
} from '../lib/mockData';
import { generateOTP } from '../lib/utils';
import { isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase';
import * as api from '../lib/api';

export type BackendStatus = 'connected' | 'demo' | 'connecting' | 'error';

interface AppContextType {
  currentUser: Profile;
  userRole: UserRole;
  trips: Trip[];
  requests: DeliveryRequest[];
  bookings: Booking[];
  notifications: AppNotification[];
  ratings: Rating[];
  backendStatus: BackendStatus;
  isLiveBackend: boolean;
  backendMessage: string;
  refreshData: () => Promise<void>;
  
  // Actions
  switchRole: (role: UserRole) => void;
  loginAs: (user: Profile) => void;
  createDeliveryRequest: (request: Omit<DeliveryRequest, 'id' | 'created_at' | 'status' | 'customer_id'>) => Promise<DeliveryRequest>;
  postTrip: (trip: Omit<Trip, 'id' | 'created_at' | 'status' | 'driver_id'>) => Promise<Trip>;
  createBooking: (tripId: string, requestId?: string, customCargo?: { name: string; weight: number; price: number; matchScore: number; tripDetails?: Trip }) => Promise<Booking>;
  updateBookingStatus: (bookingId: string, newStatus: BookingStatus) => Promise<void>;
  verifyDeliveryOTP: (bookingId: string, enteredOtp: string) => Promise<{ success: boolean; message: string }>;
  submitRating: (bookingId: string, rating: number, review?: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  unreadNotificationsCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'cargomatch_current_user',
  TRIPS: 'cargomatch_trips',
  REQUESTS: 'cargomatch_requests',
  BOOKINGS: 'cargomatch_bookings',
  NOTIFICATIONS: 'cargomatch_notifications',
  RATINGS: 'cargomatch_ratings',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isConfigured = isSupabaseConfigured();
  const [backendStatus, setBackendStatus] = useState<BackendStatus>(isConfigured ? 'connecting' : 'demo');
  const [backendMessage, setBackendMessage] = useState<string>(
    isConfigured ? 'Connecting to Supabase PostgreSQL...' : 'Running in Local Demo Mode (Local Storage)'
  );

  const [currentUser, setCurrentUser] = useState<Profile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return MOCK_CUSTOMERS[0];
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRIPS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return MOCK_TRIPS;
  });

  const [requests, setRequests] = useState<DeliveryRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return MOCK_REQUESTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return MOCK_BOOKINGS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return MOCK_NOTIFICATIONS;
  });

  const [ratings, setRatings] = useState<Rating[]>([]);

  // Local storage persistence fallback
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Fetch initial data from Supabase if configured
  const loadSupabaseData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setBackendStatus('demo');
      setBackendMessage('Running in Local Demo Mode (Local Storage)');
      return;
    }

    setBackendStatus('connecting');
    const testResult = await testSupabaseConnection();

    if (!testResult.success) {
      setBackendStatus('error');
      setBackendMessage(testResult.message);
      return;
    }

    setBackendStatus('connected');
    setBackendMessage(testResult.message);

    try {
      // Parallel fetch from PostgreSQL
      const [tripsRes, requestsRes, bookingsRes, notifsRes] = await Promise.all([
        api.fetchTrips(),
        api.fetchDeliveryRequests(),
        api.fetchBookings(),
        currentUser ? api.fetchNotifications(currentUser.id) : Promise.resolve({ data: [], error: null }),
      ]);

      if (tripsRes.data && tripsRes.data.length > 0) {
        setTrips(tripsRes.data);
      }
      if (requestsRes.data && requestsRes.data.length > 0) {
        setRequests(requestsRes.data);
      }
      if (bookingsRes.data && bookingsRes.data.length > 0) {
        setBookings(bookingsRes.data);
      }
      if (notifsRes.data && notifsRes.data.length > 0) {
        setNotifications(notifsRes.data);
      }
    } catch (err: any) {
      console.warn('Error loading Supabase data:', err);
    }
  }, [currentUser]);

  useEffect(() => {
    loadSupabaseData();
  }, [loadSupabaseData]);

  // Realtime Subscriptions Setup
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const unsubTrips = api.subscribeToTrips(() => {
      api.fetchTrips().then((res) => {
        if (res.data) setTrips(res.data);
      });
    });

    const unsubRequests = api.subscribeToRequests(() => {
      api.fetchDeliveryRequests().then((res) => {
        if (res.data) setRequests(res.data);
      });
    });

    const unsubBookings = api.subscribeToBookings(() => {
      api.fetchBookings().then((res) => {
        if (res.data) setBookings(res.data);
      });
    });

    const unsubNotifs = currentUser
      ? api.subscribeToNotifications(currentUser.id, () => {
          api.fetchNotifications(currentUser.id).then((res) => {
            if (res.data) setNotifications(res.data);
          });
        })
      : () => {};

    return () => {
      unsubTrips();
      unsubRequests();
      unsubBookings();
      unsubNotifs();
    };
  }, [currentUser]);

  const switchRole = (role: UserRole) => {
    if (role === 'customer') {
      setCurrentUser(MOCK_CUSTOMERS[0]);
    } else {
      setCurrentUser(MOCK_DRIVERS[0]);
    }
  };

  const loginAs = (user: Profile) => {
    setCurrentUser(user);
  };

  const addNotification = async (notif: Omit<AppNotification, 'id' | 'created_at' | 'read'>) => {
    const localNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [localNotif, ...prev]);

    if (isSupabaseConfigured()) {
      await api.createNotification(notif);
    }
  };

  const createDeliveryRequest = async (
    data: Omit<DeliveryRequest, 'id' | 'created_at' | 'status' | 'customer_id'>
  ): Promise<DeliveryRequest> => {
    const newReq: DeliveryRequest = {
      ...data,
      id: `req-${Date.now()}`,
      customer_id: currentUser.id,
      customer: currentUser,
      status: 'OPEN',
      created_at: new Date().toISOString(),
    };

    // Optimistic state update
    setRequests((prev) => [newReq, ...prev]);

    // Backend sync
    if (isSupabaseConfigured()) {
      const res = await api.createDeliveryRequest({
        ...data,
        customer_id: currentUser.id,
      });
      if (res.data) {
        setRequests((prev) => prev.map((r) => (r.id === newReq.id ? res.data! : r)));
      }
    }

    await addNotification({
      user_id: currentUser.id,
      title: 'Delivery Request Created',
      message: `Your cargo request for ${newReq.cargo_name} (${newReq.source} → ${newReq.destination}) is live and matching vehicles.`,
      type: 'status_update',
    });

    return newReq;
  };

  const postTrip = async (
    data: Omit<Trip, 'id' | 'created_at' | 'status' | 'driver_id'>
  ): Promise<Trip> => {
    const newTrip: Trip = {
      ...data,
      id: `trip-${Date.now()}`,
      driver_id: currentUser.id,
      driver: currentUser,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };

    // Optimistic state update
    setTrips((prev) => [newTrip, ...prev]);

    // Backend sync
    if (isSupabaseConfigured()) {
      const res = await api.createTrip({
        ...data,
        driver_id: currentUser.id,
      });
      if (res.data) {
        setTrips((prev) => prev.map((t) => (t.id === newTrip.id ? res.data! : t)));
      }
    }

    await addNotification({
      user_id: currentUser.id,
      title: 'Trip Posted Successfully',
      message: `Your trip from ${newTrip.source} → ${newTrip.destination} with ${newTrip.available_capacity} kg capacity is now discoverable.`,
      type: 'trip',
    });

    return newTrip;
  };

  const createBooking = async (
    tripId: string,
    requestId?: string,
    customCargo?: { name: string; weight: number; price: number; matchScore: number; tripDetails?: Trip }
  ): Promise<Booking> => {
    const trip = customCargo?.tripDetails || trips.find((t) => t.id === tripId) || MOCK_TRIPS[0];
    const req = requestId ? requests.find((r) => r.id === requestId) : undefined;
    const otp = generateOTP();

    const weightBooked = req ? req.weight : customCargo?.weight || 10;
    const bookingPrice = customCargo?.price || Math.round(trip.price * (weightBooked / 10));
    const score = customCargo?.matchScore || 98;

    const newBooking: Booking = {
      id: `bk-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: currentUser.id,
      customer: currentUser,
      driver_id: trip.driver_id || MOCK_DRIVERS[0].id,
      driver: trip.driver || MOCK_DRIVERS[0],
      trip_id: trip.id,
      trip: trip,
      request_id: requestId,
      request: req || (customCargo ? {
        id: `req-gen-${Date.now()}`,
        customer_id: currentUser.id,
        source: trip.source,
        destination: trip.destination,
        pickup_address: 'Standard Pickup Terminal',
        delivery_address: 'Destination City Hub',
        cargo_name: customCargo.name,
        category: 'General Commercial Goods',
        weight: customCargo.weight,
        quantity: 1,
        fragile: false,
        pickup_date: new Date().toISOString().split('T')[0],
        delivery_date: new Date().toISOString().split('T')[0],
        status: 'BOOKED',
        created_at: new Date().toISOString(),
      } : undefined),
      price: bookingPrice,
      match_score: score,
      status: 'PENDING',
      otp: otp,
      otp_verified: false,
      booked_at: new Date().toISOString(),
    };

    // Update remaining available capacity on the trip
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? { ...t, available_capacity: Math.max(0, t.available_capacity - weightBooked) }
          : t
      )
    );

    // Update request status if linked
    if (requestId) {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'BOOKED' } : r))
      );
      if (isSupabaseConfigured()) {
        api.updateDeliveryRequestStatus(requestId, 'BOOKED');
      }
    }

    setBookings((prev) => [newBooking, ...prev]);

    // Backend sync
    if (isSupabaseConfigured()) {
      const res = await api.createBooking({
        customer_id: currentUser.id,
        driver_id: trip.driver_id || MOCK_DRIVERS[0].id,
        trip_id: trip.id,
        request_id: requestId,
        price: bookingPrice,
        match_score: score,
        otp: otp,
      });
      if (res.data) {
        setBookings((prev) => prev.map((b) => (b.id === newBooking.id ? res.data! : b)));
      }
    }

    // Customer Notification
    await addNotification({
      user_id: currentUser.id,
      title: 'Booking Confirmed!',
      message: `Your booking for ${weightBooked} kg space with driver ${trip.driver?.full_name || 'Rajesh'} has been placed. Secure delivery OTP: ${otp}.`,
      type: 'booking',
    });

    // Driver Notification
    await addNotification({
      user_id: trip.driver_id || MOCK_DRIVERS[0].id,
      title: 'New Cargo Request Received',
      message: `A customer requested to book ${weightBooked} kg space on your ${trip.source} → ${trip.destination} route for ₹${bookingPrice}.`,
      type: 'booking',
    });

    return newBooking;
  };

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated = { ...b, status: newStatus };
          if (newStatus === 'DELIVERED') {
            updated.delivered_at = new Date().toISOString();
          }
          return updated;
        }
        return b;
      })
    );

    if (isSupabaseConfigured()) {
      await api.updateBookingStatus(bookingId, newStatus);
    }

    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (targetBooking) {
      await addNotification({
        user_id: targetBooking.customer_id,
        title: `Delivery Status: ${newStatus.replace(/_/g, ' ')}`,
        message: `Your delivery #${targetBooking.id} is now ${newStatus.toLowerCase().replace(/_/g, ' ')}.`,
        type: 'status_update',
      });
    }
  };

  const verifyDeliveryOTP = async (
    bookingId: string,
    enteredOtp: string
  ): Promise<{ success: boolean; message: string }> => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, message: 'Booking not found.' };
    }

    if (booking.otp.trim() === enteredOtp.trim()) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: 'DELIVERED',
                otp_verified: true,
                delivered_at: new Date().toISOString(),
              }
            : b
        )
      );

      if (isSupabaseConfigured()) {
        await api.verifyDeliveryOTP(bookingId, enteredOtp);
      }

      await addNotification({
        user_id: booking.customer_id,
        title: 'Delivery Completed Successfully! 🎉',
        message: `Your cargo #${booking.id} was handed over and verified via OTP. Please rate your driver.`,
        type: 'status_update',
      });

      await addNotification({
        user_id: booking.driver_id,
        title: 'OTP Verified — Payout Credited! 💰',
        message: `Delivery #${booking.id} verified. ₹${booking.price} has been credited to your earnings.`,
        type: 'booking',
      });

      return { success: true, message: 'OTP verified! Delivery marked completed.' };
    } else {
      return { success: false, message: 'Invalid delivery OTP. Please try again.' };
    }
  };

  const submitRating = async (bookingId: string, ratingValue: number, review?: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const newRating: Rating = {
      id: `rat-${Date.now()}`,
      booking_id: bookingId,
      customer_id: currentUser.id,
      driver_id: booking.driver_id,
      rating: ratingValue,
      review: review,
      created_at: new Date().toISOString(),
    };

    setRatings((prev) => [newRating, ...prev]);

    if (isSupabaseConfigured()) {
      await api.submitRating({
        booking_id: bookingId,
        customer_id: currentUser.id,
        driver_id: booking.driver_id,
        rating: ratingValue,
        review: review,
      });
    }

    const driverId = booking.driver_id;
    const allDriverRatings = [...ratings, newRating].filter((r) => r.driver_id === driverId);
    const avg =
      allDriverRatings.reduce((sum, r) => sum + r.rating, 0) / allDriverRatings.length;

    MOCK_DRIVERS.forEach((d) => {
      if (d.id === driverId) {
        d.rating = Number(avg.toFixed(1));
        d.total_deliveries = (d.total_deliveries || 0) + 1;
      }
    });

    await addNotification({
      user_id: booking.driver_id,
      title: 'New Customer Rating Received',
      message: `You received a ${ratingValue}★ rating from ${currentUser.full_name}.`,
      type: 'system',
    });
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (isSupabaseConfigured()) {
      await api.markNotificationAsRead(id);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (isSupabaseConfigured() && currentUser) {
      await api.markAllNotificationsAsRead(currentUser.id);
    }
  };

  const unreadNotificationsCount = notifications.filter(
    (n) => n.user_id === currentUser.id && !n.read
  ).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole: currentUser.role,
        trips,
        requests,
        bookings,
        notifications,
        ratings,
        backendStatus,
        isLiveBackend: backendStatus === 'connected',
        backendMessage,
        refreshData: loadSupabaseData,
        switchRole,
        loginAs,
        createDeliveryRequest,
        postTrip,
        createBooking,
        updateBookingStatus,
        verifyDeliveryOTP,
        submitRating,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
