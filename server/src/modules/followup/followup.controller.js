import mongoose from 'mongoose';
import { FollowUp } from '../../models/FollowUp.js';
import { memoryStore } from '../../config/memoryStore.js';

export const getDueFollowUps = async (req, res, next) => {
  try {
    const { program, status, workerId } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (program) query.program = program;
      if (status) query.status = status;
      if (workerId) query.assignedWorkerId = workerId;
      if (req.user.role === 'health_worker' && !workerId) query.assignedWorkerId = req.user._id;

      const followUps = await FollowUp.find(query)
        .populate('patientId', 'name patientId phone age gender village riskLevel pregnancy conditions')
        .populate('assignedWorkerId', 'name phone')
        .sort({ dueDate: 1 });
      return res.json({ success: true, data: followUps });
    }

    let followUps = [...memoryStore.followUps];
    if (program) followUps = followUps.filter(f => f.program === program);
    if (status) followUps = followUps.filter(f => f.status === status);
    res.json({ success: true, data: followUps });
  } catch (err) {
    next(err);
  }
};

export const updateFollowUp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, observations } = req.body;

    if (mongoose.connection.readyState === 1) {
      const followUp = await FollowUp.findById(id);
      if (!followUp) return res.status(404).json({ success: false, message: 'Follow-up task not found' });
      if (status) followUp.status = status;
      if (notes) followUp.notes = notes;
      if (observations) followUp.observations = observations;
      if (status === 'Completed') followUp.completedAt = new Date();
      await followUp.save();
      return res.json({ success: true, message: 'Follow-up task updated successfully', data: followUp });
    }

    const followUp = memoryStore.followUps.find(f => f._id === id);
    if (!followUp) return res.status(404).json({ success: false, message: 'Follow-up task not found' });
    if (status) followUp.status = status;
    if (notes) followUp.notes = notes;
    if (observations) followUp.observations = observations;
    if (status === 'Completed') followUp.completedAt = new Date();

    res.json({ success: true, message: 'Follow-up task updated successfully', data: followUp });
  } catch (err) {
    next(err);
  }
};

