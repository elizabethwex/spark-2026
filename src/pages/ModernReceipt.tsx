import React from 'react';
import { Camera, Clock, Activity, ShieldCheck } from 'lucide-react';

export default function ModernReceipt() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans text-gray-900">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-xl shadow-gray-200/40 p-8 border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Action Needed
          </span>
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md">
            1 Task
          </span>
        </div>

        {/* Urgency Pill */}
        <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-1 rounded-md text-xs font-semibold mb-5">
          <Clock className="w-3.5 h-3.5" />
          28 days left to file
        </div>

        {/* Hero Typography */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-4">
          Missing receipt <br />
          <span className="text-gray-300">required.</span>
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-base mb-8 leading-relaxed">
          Upload your receipt for Dr. Miller to complete this FSA claim.
        </p>

        {/* Transaction Sub-card */}
        <div className="bg-white rounded-xl p-4 mb-8 flex items-center justify-between border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-200">
              <Activity className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Dr. Miller (Dental)</p>
              <p className="text-sm text-gray-500 mt-0.5">Yesterday • FSA Account</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900 text-base">$340.00</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
            <Camera className="w-5 h-5" />
            Upload receipt
          </button>

          <button className="w-full text-center py-3.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors">
            Remind me tomorrow
          </button>
        </div>
        
        {/* Trust Reassurance */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>Secure upload • Takes less than a minute</span>
        </div>
        
      </div>
    </div>
  );
}
