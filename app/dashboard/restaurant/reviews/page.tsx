'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const demoReviews = [
  { name: 'Priya K.', rating: 5, comment: 'Fresh sourdough was amazing! Picked up at 9 PM and it was still warm.', date: '2 days ago' },
  { name: 'Rahul S.', rating: 4, comment: 'Great value for the price — will definitely be back!', date: '5 days ago' },
  { name: 'Divya M.', rating: 5, comment: 'Love what this platform is doing. Saved money and reduced waste!', date: '1 week ago' },
];

export default function RestaurantReviewsPage() {
  const avgRating = (demoReviews.reduce((a, r) => a + r.rating, 0) / demoReviews.length).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Restaurant Portal</div>
          <h1 className="text-2xl font-bold text-on-surface">Reviews</h1>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Customer feedback on your meals and service.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#e1bfb5]/40 shadow-sm flex items-center gap-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-primary">{avgRating}</p>
            <p className="text-xs font-bold text-on-surface-variant mt-1">Average Rating</p>
            <div className="flex justify-center mt-1 gap-0.5">
              {[1,2,3,4,5].map(s => <span key={s} className={`text-lg ${s <= Math.round(+avgRating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>)}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-on-surface mb-2">{demoReviews.length} reviews total</p>
            {[5,4,3].map(r => (
              <div key={r} className="flex items-center gap-2 mb-1">
                <span className="text-xs text-on-surface-variant w-4">{r}★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${(demoReviews.filter(rev => rev.rating === r).length / demoReviews.length) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {demoReviews.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#e1bfb5]/40 p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-on-surface">{r.name}</p>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>)}
                </div>
              </div>
              <p className="text-xs text-on-surface-variant">{r.comment}</p>
              <p className="text-[11px] text-on-surface-variant">{r.date}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
