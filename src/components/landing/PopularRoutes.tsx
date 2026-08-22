import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { POPULAR_ROUTES } from '../../lib/mockData';
import { MapPin, ArrowRight, TrendingDown, Truck } from 'lucide-react';

export const PopularRoutes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Active Highway Corridors
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              High-Frequency Shared Capacity Routes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md">
            Multiple verified vehicles depart daily on these primary intercity logistics corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_ROUTES.map((route, idx) => (
            <Card
              key={idx}
              className="p-5 border-slate-200 hover:border-blue-300 hover:shadow-card transition-all flex flex-col justify-between group cursor-pointer"
              onClick={() =>
                navigate(`/auth?role=customer&source=${route.from}&destination=${route.to}`)
              }
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {route.distance}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> Save {route.avgSavings}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-bold text-slate-900 text-sm">{route.from}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-slate-900 text-sm">{route.to}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1.5 font-medium">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  {route.activeTrips} active vehicle trips
                </span>
                <span className="text-blue-600 font-bold group-hover:underline flex items-center gap-1">
                  View Trips <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
