import mongoose, { Mongoose } from 'mongoose';
import { logger } from './logger';

/**
 * @returns connection string based on DB_HOST, DB_PASSWORD, DB_PORT, DB_USER and DB_DATABASE Environment Variables.
 * If not specified, defaults to local connection string
 */
const getDbConnectionString = (): string => {
  const { DB_HOST, DB_PASSWORD, DB_PORT, DB_USER, DB_DATABASE } = process.env;
  let connectionString = 'mongodb://localhost:27017/local';

  if (DB_HOST && DB_PASSWORD && DB_PORT && DB_USER && DB_DATABASE) {
    connectionString = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
  }

  return connectionString;
};

/**
 * Connects to MongoDB and returns connection instance (if successful)
 */
const connectDB = async (): Promise<Mongoose> => {
  try {
    const connection = await mongoose.connect(getDbConnectionString(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info('💾 Connected to Database!');
    return connection;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export { connectDB };
