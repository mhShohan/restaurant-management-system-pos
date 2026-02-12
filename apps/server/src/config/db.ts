import { config } from '@config';
import { logger } from '@utils/logger';
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.LOCAL_MONGO_URI);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('Error to connecting database:', error);
    process.exit(1);
  }
};

export default connectDB;
