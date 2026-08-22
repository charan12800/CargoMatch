import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Star, X, CheckCircle2, MessageSquare, Award } from 'lucide-react';
import { Booking } from '../../types';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSubmit: (bookingId: string, rating: number, review?: string) => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [review, setReview] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual']);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !booking) return null;

  const quickTags = [
    'Punctual Arrival',
    'Careful Handling',
    'Great Communication',
    'Polite & Courteous',
    'Safe Driving',
    'Clean Vehicle Bed',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReview = [
      ...selectedTags,
      review.trim(),
    ]
      .filter(Boolean)
      .join(' • ');

    onSubmit(booking.id, rating, finalReview);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Rate Your Experience</h3>
              <p className="text-xs text-slate-400">Driver: {booking.driver?.full_name || 'Rajesh Kumar'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Thank You For Your Feedback!</h4>
            <p className="text-xs text-slate-500">Your rating helps build trusted community transport.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Interactive Stars */}
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Select Star Rating
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= (hoverRating ?? rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-amber-600 block">
                {rating === 5 && 'Outstanding & Professional'}
                {rating === 4 && 'Very Good Service'}
                {rating === 3 && 'Average Experience'}
                {rating === 2 && 'Needs Improvement'}
                {rating === 1 && 'Poor Experience'}
              </span>
            </div>

            {/* Quick Tag Pills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                What went well?
              </span>
              <div className="flex flex-wrap gap-2">
                {quickTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}{tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review text */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Optional Written Feedback
              </label>
              <textarea
                rows={3}
                placeholder="Share more details about package handling, route timing, etc."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={onClose}
                className="flex-1"
              >
                Skip
              </Button>
              <Button
                type="submit"
                variant="amber"
                size="md"
                className="flex-1 font-bold text-slate-950"
              >
                Submit Review
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
