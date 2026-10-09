import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentApi, facilityApi, patientApi } from '../../api/endpoints';
import { Calendar, Clock, Building2, User, Video, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const PatientAppointments = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form State
  const todayStr = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    facilityId: '',
    department: 'General Medicine',
    doctorId: '',
    appointmentDate: todayStr,
    appointmentTime: '10:30',
    mode: 'In-Person',
    reason: '',
  });

  const loadData = async () => {
    try {
      const [patRes, facRes] = await Promise.all([
        patientApi.getAll({ search: user?.phone }),
        facilityApi.getAll(),
      ]);

      if (patRes.data && patRes.data.length > 0) {
        const p = patRes.data[0];
        setPatient(p);
        const aptRes = await appointmentApi.getAll({ patientId: p._id });
        if (aptRes.data) setAppointments(aptRes.data);
      }

      if (facRes.data && facRes.data.length > 0) {
        setFacilities(facRes.data);
        const defaultFacId = facRes.data[0]._id;
        setFormData(prev => ({ ...prev, facilityId: defaultFacId }));
        // Load doctors for default facility
        const docRes = await facilityApi.getDoctors(defaultFacId);
        if (docRes.data && docRes.data.length > 0) {
          setDoctors(docRes.data);
          setFormData(prev => ({ ...prev, doctorId: docRes.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load appointments data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleFacilityChange = async (facId) => {
    setFormData(prev => ({ ...prev, facilityId: facId, doctorId: '' }));
    try {
      const docRes = await facilityApi.getDoctors(facId);
      if (docRes.data && docRes.data.length > 0) {
        setDoctors(docRes.data);
        setFormData(prev => ({ ...prev, doctorId: docRes.data[0]._id }));
      } else {
        setDoctors([]);
      }
    } catch (err) {
      console.warn('Doctor fetch failed:', err.message);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!patient) {
      toast.error('Patient profile required to book appointment');
      return;
    }
    if (!formData.doctorId || !formData.facilityId) {
      toast.error('Please select both a facility and an available doctor');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await appointmentApi.create({
        patientId: patient._id,
        doctorId: formData.doctorId,
        facilityId: formData.facilityId,
        department: formData.department,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        mode: formData.mode,
        reason: formData.reason,
      });

      toast.success(`Appointment confirmed! Token #${res.data?.tokenNumber}`);
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to book appointment');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading appointment schedules...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-navy-900">Appointments & Consultation Queue</h1>
        <p className="text-xs text-gray-500 mt-1">
          Book OPD slots or schedule teleconsultations with certified medical officers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Booking Form (Left Col 5) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-surface-border shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy-900 flex items-center gap-2 border-b border-surface-border pb-3">
            <Plus className="w-4 h-4 text-brand-500" />
            <span>Book New Healthcare Slot</span>
          </h2>

          <form onSubmit={handleBook} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Select Healthcare Facility</label>
              <select
                required
                value={formData.facilityId}
                onChange={(e) => handleFacilityChange(e.target.value)}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              >
                {facilities.map((fac) => (
                  <option key={fac._id} value={fac._id}>
                    {fac.name} ({fac.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              >
                <option value="General Medicine">General Medicine</option>
                <option value="Obstetrics & Gynaecology">Obstetrics & Gynaecology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Available Medical Officer</label>
              <select
                required
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              >
                {doctors.length > 0 ? (
                  doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.name} ({doc.department || 'General Medicine'})
                    </option>
                  ))
                ) : (
                  <option value="">No doctors currently available at facility</option>
                )}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Time Slot</label>
                <select
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
                >
                  <option value="09:30">09:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Consultation Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: 'In-Person' })}
                  className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                    formData.mode === 'In-Person' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-surface-border text-gray-600'
                  }`}
                >
                  🏥 In-Person OPD
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, mode: 'Online' })}
                  className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                    formData.mode === 'Online' ? 'bg-brand-50 border-brand-500 text-brand-700' : 'border-surface-border text-gray-600'
                  }`}
                >
                  📹 Tele-Video Call
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Reason for Visit / Symptoms</label>
              <textarea
                rows={2}
                placeholder="Briefly describe health concerns..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-3 py-2 border border-surface-border rounded-lg focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              {bookingLoading ? 'Reserving Slot...' : 'Confirm Appointment Booking'}
            </button>
          </form>
        </div>

        {/* Existing Appointments List (Right Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-bold text-navy-900 flex items-center justify-between">
            <span>My Booked Consultations</span>
            <span className="text-xs font-normal text-gray-500">{appointments.length} total</span>
          </h2>

          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt._id} className="bg-white p-5 rounded-2xl border border-surface-border shadow-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                          Token #{apt.tokenNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'Waiting' ? 'bg-amber-100 text-amber-800' :
                          apt.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-navy-900 mt-2">
                        Dr. {apt.doctorId?.name || 'Assigned Doctor'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {apt.department} • {apt.facilityId?.name}
                      </p>
                    </div>

                    <div className="text-right text-xs text-gray-600">
                      <p className="font-semibold text-dark-text">{apt.appointmentDate}</p>
                      <p className="text-[11px] text-gray-500">{apt.appointmentTime || '10:00 AM'}</p>
                    </div>
                  </div>

                  {apt.reason && (
                    <p className="text-xs text-gray-600 bg-surface-bg p-2.5 rounded-lg">
                      <span className="font-semibold text-gray-700">Complaint:</span> {apt.reason}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-surface-border text-xs">
                    <span className="text-gray-500">
                      Mode: <span className="font-semibold text-dark-text">{apt.mode}</span>
                    </span>

                    {apt.mode === 'Online' && (apt.status === 'In Progress' || apt.status === 'Scheduled' || apt.status === 'Waiting') && (
                      <a
                        href={`https://meet.jit.si/${apt.teleRoomId || 'SwasthSetu-Demo'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Consultation Call</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-surface-border text-xs text-gray-500">
              No appointments found. Use the booking panel to schedule one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

