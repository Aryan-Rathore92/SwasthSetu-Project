import React, { useState, useEffect } from 'react';
import { followupApi } from '../../api/endpoints';
import { ClipboardList, CheckCircle2, AlertTriangle, User, Calendar, MessageSquare, Plus } from 'lucide-react';
import { toast } from 'sonner';

export const HealthWorkerFollowUps = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [note, setNote] = useState('');
  const [statusToSet, setStatusToSet] = useState('Completed');

  const loadFollowUps = async () => {
    try {
      const res = await followupApi.getDue();
      if (res.data) setTasks(res.data);
    } catch (err) {
      console.error('Failed to load follow-up tasks:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowUps();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    try {
      await followupApi.update(selectedTask._id, {
        status: statusToSet,
        notes: note || selectedTask.notes,
      });
      toast.success(`Follow-up task updated to '${statusToSet}'`);
      setSelectedTask(null);
      setNote('');
      loadFollowUps();
    } catch (err) {
      toast.error('Failed to update task: ' + err.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-xs text-gray-500">Loading follow-up tasks...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy-900">Frontline Follow-Up & Outreach Tasks</h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor maternal antenatal visits, chronic hypertension tracking, and home outreach visits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white rounded-2xl border border-surface-border p-5 shadow-xs space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                task.program === 'Maternal' ? 'bg-pink-100 text-pink-800' :
                task.program === 'Chronic Disease' ? 'bg-blue-100 text-blue-800' :
                task.program === 'Child Health' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {task.program} Program
              </span>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                task.status === 'Flagged for Doctor' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {task.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-navy-900 text-sm">{task.patientId?.name || 'Community Patient'}</h3>
              <p className="text-[11px] text-gray-500">
                Village: {task.patientId?.village} • Due: {task.dueDate}
              </p>
            </div>

            <p className="p-2.5 bg-surface-bg rounded-xl text-gray-700 leading-relaxed">
              {task.notes || 'Routine follow-up task.'}
            </p>

            {task.observations && (
              <p className="p-2 bg-red-50 text-red-800 rounded-lg text-[11px] font-medium">
                ⚠️ {task.observations}
              </p>
            )}

            <div className="pt-2 border-t border-surface-border flex justify-end">
              <button
                onClick={() => { setSelectedTask(task); setNote(task.notes || ''); }}
                className="px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-lg font-semibold text-[11px] transition-colors"
              >
                Update Task Status →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-navy-900">
              Update Follow-Up: {selectedTask.patientId?.name}
            </h3>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={statusToSet}
                  onChange={(e) => setStatusToSet(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-border rounded-lg"
                >
                  <option value="Completed">Completed (Visit Conducted)</option>
                  <option value="Flagged for Doctor">Flag Concern for Medical Officer</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Worker Notes & Recorded Observations</label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Record blood pressure, maternal complaints, or medication notes..."
                  className="w-full px-3 py-2 border border-surface-border rounded-lg"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

