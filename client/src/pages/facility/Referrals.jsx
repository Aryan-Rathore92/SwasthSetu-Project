import React, { useState, useEffect } from 'react';
import { referralApi } from '../../api/endpoints';
import { GitBranch, CheckCircle2, UserCheck, Check, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const FacilityReferrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReferrals = async () => {
    try {
      const res = await referralApi.getAll();
      if (res.data) setReferrals(res.data);
    } catch (err) {
      console.error('Failed to load facility referrals:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReferrals();
  }, []);

  const handleAccept = async (id) => {
    try {
      await referralApi.accept(id, 'Referral accepted by facility reception');
      toast.success('Referral accepted! Notification dispatched to referring doctor.');
      loadReferrals();
    } catch (err) {
      toast.error('Accept failed: ' + err.message);
    }
  };

  const handleMarkArrived = async (id) => {
    try {
      await referralApi.markArrived(id, 'Patient physically checked in at destination facility');
      toast.success('Patient arrival confirmed at facility!');
      loadReferrals();
    } catch (err) {
      toast.error('Arrival update failed: ' + err.message);
    }
  };

  const handleClose = async (id) => {
    try {
      await referralApi.close(id, 'Specialist consultation concluded, case closed');
      toast.success('Referral case completed and closed!');
      loadReferrals();
    } catch (err) {
      toast.error('Close failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Facility Referral Coordination Desk</h1>
        <p className="text-xs text-gray-500 mt-1">Review transfer notices, accept incoming admissions, and track patient arrivals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {referrals.map((ref) => (
          <div key={ref._id} className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                ref.priority === 'Emergency' ? 'bg-red-100 text-red-800' :
                ref.priority === 'Urgent' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {ref.priority}
              </span>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                ref.status === 'Closed' ? 'bg-emerald-100 text-emerald-800' :
                ref.status === 'Arrived' ? 'bg-indigo-100 text-indigo-800' :
                ref.status === 'Accepted' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {ref.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-navy-900 text-sm">{ref.patientId?.name || 'Patient'}</h3>
              <p className="text-[11px] text-gray-500">
                From: {ref.fromFacilityId?.name} → To: {ref.toFacilityId?.name}
              </p>
              <p className="text-[11px] text-brand-600 font-semibold mt-0.5">
                Dept: {ref.department}
              </p>
            </div>

            <p className="p-2.5 bg-surface-bg rounded-xl text-gray-700 leading-relaxed">
              {ref.reason}
            </p>

            {/* Transition Action Buttons */}
            <div className="pt-2 border-t border-surface-border flex flex-wrap gap-2 justify-end">
              {ref.status === 'Created' && (
                <button
                  onClick={() => handleAccept(ref._id)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-[11px] transition-colors"
                >
                  Accept Referral
                </button>
              )}
              {ref.status === 'Accepted' && (
                <button
                  onClick={() => handleMarkArrived(ref._id)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-[11px] transition-colors"
                >
                  Mark Patient Arrived
                </button>
              )}
              {ref.status === 'Arrived' && (
                <button
                  onClick={() => handleClose(ref._id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] transition-colors"
                >
                  Complete & Close Case
                </button>
              )}
              {ref.status === 'Closed' && (
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Case Concluded</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

