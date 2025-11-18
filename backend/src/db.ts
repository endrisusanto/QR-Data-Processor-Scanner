import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('MONGO_URI is not defined in the environment variables');
      // FIX: Throw an error instead of calling process.exit to allow for better error handling by the caller.
      throw new Error('MONGO_URI is not defined in the environment variables');
    }
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    // FIX: Re-throw the error to allow the application startup to fail gracefully.
    throw err;
  }
};

export default connectDB;