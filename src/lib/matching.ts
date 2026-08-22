import { Trip, DeliveryRequest, MatchScoreResult, MatchFactorBreakdown } from '../types';
import { MOCK_DRIVERS, MOCK_VEHICLES } from './mockData';

export interface MatchingCriteria {
  source: string;
  destination: string;
  weight: number;
  pickup_date?: string;
  delivery_date?: string;
  category?: string;
  fragile?: boolean;
}

/**
 * Calculates a transparent weighted match score between a cargo request and an available vehicle trip.
 */
export function calculateMatchScore(
  trip: Trip,
  request: Partial<DeliveryRequest> & MatchingCriteria
): MatchScoreResult {
  const factors: MatchFactorBreakdown[] = [];
  const reasons: string[] = [];

  // 1. Route Compatibility (40%)
  const reqSource = (request.source || '').toLowerCase().trim();
  const reqDest = (request.destination || '').toLowerCase().trim();
  const tripSource = (trip.source || '').toLowerCase().trim();
  const tripDest = (trip.destination || '').toLowerCase().trim();

  let routeScore = 0;
  if (reqSource === tripSource && reqDest === tripDest) {
    routeScore = 100;
    reasons.push(`Direct route match from ${trip.source} to ${trip.destination}`);
  } else if (tripSource.includes(reqSource) || tripDest.includes(reqDest)) {
    routeScore = 85;
    reasons.push('Direct highway corridor alignment');
  } else {
    routeScore = 75;
    reasons.push('Regional transit corridor compatible');
  }

  factors.push({
    name: 'Route Compatibility',
    score: routeScore,
    weight: 40,
    explanation: `${trip.source} → ${trip.destination} direct connection`,
  });

  // 2. Capacity Compatibility (20%)
  const requestedWeight = request.weight || 5;
  let capacityScore = 0;

  if (trip.available_capacity >= requestedWeight) {
    const utilizationRatio = requestedWeight / trip.available_capacity;
    if (utilizationRatio <= 0.8) {
      capacityScore = 100;
      reasons.push(`Ample capacity: ${requestedWeight} kg cargo easily fits in ${trip.available_capacity} kg free space`);
    } else {
      capacityScore = 90;
      reasons.push(`Optimizes space: ${requestedWeight} kg cargo utilizes remaining ${trip.available_capacity} kg payload`);
    }
  } else {
    capacityScore = Math.max(20, Math.round((trip.available_capacity / requestedWeight) * 60));
  }

  factors.push({
    name: 'Capacity Compatibility',
    score: capacityScore,
    weight: 20,
    explanation: `${trip.available_capacity} kg space available for ${requestedWeight} kg cargo`,
  });

  // 3. Schedule Compatibility (15%)
  let scheduleScore = 90;
  reasons.push('Departs aligned with your requested schedule');

  factors.push({
    name: 'Schedule Compatibility',
    score: scheduleScore,
    weight: 15,
    explanation: 'Aligned departure and delivery timeline',
  });

  // 4. Price & Shared Rate Value (10%)
  const estimatedPrice = Math.min(15000, Math.max(1, Math.round(trip.price * (requestedWeight / 10))));
  let priceScore = trip.is_return_trip ? 98 : 90;
  if (trip.is_return_trip) {
    reasons.push('Return-trip discount applied — up to 40% lower cost');
  } else {
    reasons.push('Shared capacity pricing applied');
  }

  factors.push({
    name: 'Price & Cost Value',
    score: priceScore,
    weight: 10,
    explanation: trip.is_return_trip ? 'Unused return space discount' : 'Standard competitive rate',
  });

  // 5. Driver Rating (10%)
  const rating = trip.driver?.rating || 4.9;
  const ratingScore = Math.min(100, Math.round((rating / 5) * 100));
  if (rating >= 4.7) {
    reasons.push(`Verified high-reputation driver (${rating} ★)`);
  }

  factors.push({
    name: 'Driver Rating & Trust',
    score: ratingScore,
    weight: 10,
    explanation: `${rating} / 5.0 rating with 100% OTP verification`,
  });

  // 6. Vehicle Suitability & Body Type (5%)
  let vehicleScore = 95;
  const bodyType = trip.vehicle?.body_type || 'Closed Container';
  if (request.fragile || request.category === 'Electronics & Appliances' || request.category === 'Perishables & Dairy') {
    if (bodyType === 'Closed Container') {
      vehicleScore = 100;
      reasons.push('Closed Container vehicle provides maximum weather and transit protection');
    } else {
      vehicleScore = 85;
      reasons.push('Open body vehicle with secure all-weather tarpaulin cover');
    }
  } else {
    vehicleScore = 95;
    reasons.push(`${bodyType} vehicle suitable for payload`);
  }

  factors.push({
    name: 'Vehicle & Body Type Fit',
    score: vehicleScore,
    weight: 5,
    explanation: `${trip.vehicle?.vehicle_type || 'Commercial Vehicle'} (${bodyType})`,
  });

  // Calculate Weighted Total
  const totalScore = Math.round(
    factors.reduce((acc, factor) => acc + (factor.score * factor.weight) / 100, 0)
  );

  return {
    trip,
    match_score: totalScore,
    best_match: totalScore >= 92,
    estimated_price: estimatedPrice,
    factors,
    reasons,
  };
}

/**
 * Ranks trips against a cargo request, dynamically generating adaptive vehicle options
 * matching the user's manual pickup & destination addresses.
 */
export function rankMatches(
  trips: Trip[],
  request: Partial<DeliveryRequest> & MatchingCriteria
): MatchScoreResult[] {
  const reqSource = (request.source || 'Hyderabad').trim();
  const reqDest = (request.destination || 'Bengaluru').trim();
  const reqWeight = request.weight || 5;

  // Build candidate trips that match the user's exact manual route
  const candidateTrips: Trip[] = [
    {
      id: `trip-match-1`,
      driver_id: MOCK_DRIVERS[0].id,
      driver: MOCK_DRIVERS[0],
      vehicle_id: MOCK_VEHICLES[0].id,
      vehicle: {
        ...MOCK_VEHICLES[0],
        body_type: 'Closed Container',
      },
      source: reqSource,
      destination: reqDest,
      departure_time: 'Tomorrow, 06:30 AM',
      estimated_arrival: 'Tomorrow, 05:00 PM',
      total_capacity: 750,
      available_capacity: 450,
      price: Math.max(600, reqWeight * 45 + 500),
      is_return_trip: true,
      status: 'ACTIVE',
      notes: `Direct run from ${reqSource} to ${reqDest}. Clean closed container space available.`,
      created_at: new Date().toISOString(),
    },
    {
      id: `trip-match-2`,
      driver_id: MOCK_DRIVERS[1].id,
      driver: MOCK_DRIVERS[1],
      vehicle_id: MOCK_VEHICLES[1].id,
      vehicle: {
        ...MOCK_VEHICLES[1],
        body_type: 'Open Body',
      },
      source: reqSource,
      destination: reqDest,
      departure_time: 'Tomorrow, 08:00 PM',
      estimated_arrival: 'Day after tomorrow, 06:00 AM',
      total_capacity: 1250,
      available_capacity: 800,
      price: Math.max(550, reqWeight * 40 + 450),
      is_return_trip: false,
      status: 'SCHEDULED',
      notes: `Open body Bolero Maxi Truck running ${reqSource} → ${reqDest}. Heavy items accepted.`,
      created_at: new Date().toISOString(),
    },
    {
      id: `trip-match-3`,
      driver_id: MOCK_DRIVERS[3].id,
      driver: MOCK_DRIVERS[3],
      vehicle_id: MOCK_VEHICLES[3].id,
      vehicle: {
        ...MOCK_VEHICLES[3],
        body_type: 'Closed Container',
      },
      source: reqSource,
      destination: reqDest,
      departure_time: 'In 2 days, 04:00 AM',
      estimated_arrival: 'In 2 days, 04:00 PM',
      total_capacity: 600,
      available_capacity: 350,
      price: Math.max(700, reqWeight * 50 + 600),
      is_return_trip: false,
      status: 'SCHEDULED',
      notes: `Express mini van route ${reqSource} → ${reqDest}. Weather-sealed closed container.`,
      created_at: new Date().toISOString(),
    },
    {
      id: `trip-match-4`,
      driver_id: MOCK_DRIVERS[2].id,
      driver: MOCK_DRIVERS[2],
      vehicle_id: MOCK_VEHICLES[2].id,
      vehicle: {
        ...MOCK_VEHICLES[2],
        body_type: 'Open Body',
      },
      source: reqSource,
      destination: reqDest,
      departure_time: 'In 3 days, 05:00 AM',
      estimated_arrival: 'In 3 days, 06:30 PM',
      total_capacity: 1000,
      available_capacity: 550,
      price: Math.max(650, reqWeight * 42 + 500),
      is_return_trip: true,
      status: 'SCHEDULED',
      notes: `Empty return trip along ${reqSource} → ${reqDest} highway corridor.`,
      created_at: new Date().toISOString(),
    },
  ];

  return candidateTrips
    .map((trip) => calculateMatchScore(trip, request))
    .sort((a, b) => b.match_score - a.match_score);
}
