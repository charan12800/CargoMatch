import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Mail, Phone, MapPin, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-white">
            <div className="p-2.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-base">"Don't send another vehicle. Match with one already going your way."</p>
              <p className="text-xs text-slate-400">Transforming empty vehicle kilometers into productive logistics capacity.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% OTP Verified Handshake
            </span>
            <span className="text-slate-600">•</span>
            <span>Zero Deadhead Return Initiative</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-white">
                  Cargo<span className="text-blue-500">Match</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 -mt-1">
                  Match Cargo. Move Smarter.
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              CargoMatch is an AI-powered shared-capacity logistics marketplace connecting shippers with commercial vehicles already traveling their route.
            </p>

            <div className="pt-2 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Hitec City, Hyderabad, Telangana — 500081</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@cargomatch.in</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+91 (040) 8000-CARG (Mon-Sat, 8am-9pm)</span>
              </div>
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              For Customers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/auth?role=customer" className="hover:text-blue-400 transition-colors">
                  Send Cargo
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-blue-400 transition-colors">
                  How Matching Works
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-blue-400 transition-colors">
                  Route Cost Calculator
                </a>
              </li>
              <li>
                <a href="#trust-safety" className="hover:text-blue-400 transition-colors">
                  OTP Delivery Tracking
                </a>
              </li>
              <li>
                <span className="text-slate-500 text-xs block pt-1">
                  Popular: HYD → BLR (from ₹450)
                </span>
              </li>
            </ul>
          </div>

          {/* For Drivers */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              For Drivers & Fleets
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/auth?role=driver" className="hover:text-emerald-400 transition-colors">
                  Post Your Trip
                </Link>
              </li>
              <li>
                <a href="#empty-returns" className="hover:text-emerald-400 transition-colors">
                  Monetize Empty Returns
                </a>
              </li>
              <li>
                <Link to="/auth?role=driver" className="hover:text-emerald-400 transition-colors">
                  Driver Earnings Dashboard
                </Link>
              </li>
              <li>
                <a href="#trust-safety" className="hover:text-emerald-400 transition-colors">
                  Instant Payment on OTP
                </a>
              </li>
              <li>
                <span className="text-slate-500 text-xs block pt-1">
                  Support: Tata Ace, Bolero, Pickups
                </span>
              </li>
            </ul>
          </div>

          {/* Platform & Safety */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Platform & Safety
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#ai-matching" className="hover:text-blue-400 transition-colors">
                  AI Matching Algorithm
                </a>
              </li>
              <li>
                <a href="#trust-safety" className="hover:text-blue-400 transition-colors">
                  Driver Verification Policy
                </a>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-slate-200 cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-xs border border-emerald-800/50 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Systems Operational
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CargoMatch Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built for sustainable logistics with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>in Hyderabad</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
