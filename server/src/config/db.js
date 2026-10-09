import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/swasthsetu';
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`[Database] MongoDB connection error: ${err.message}`);
    console.warn(`[Database] If running locally without a MongoDB daemon, please start MongoDB or provide a valid MONGO_URI in server/.env (e.g. MongoDB Atlas free cluster).`);
    // Don't crash immediately in dev to allow debugging if needed, but throw in seed/test
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
    return null;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch (err) {
    console.error('[Database] Disconnect error:', err.message);
  }
};

