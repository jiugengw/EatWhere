import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';
import 'module-alias/register';

dotenv.config({ path: './.env' });

import { config } from './common/utils/config';
import { AppError } from './common/utils/AppError';

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!');
  console.log(err.name, err.message);
  process.exit(1);
});

const db = config.DATABASE.replace('<db_password>', config.DATABASE_PASSWORD);

const startServer = async () => {
  try {
    await mongoose.connect(db);

    console.log('MongoDB connected');

    const port = config.PORT || 8080;
    const server = app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });

    process.on('unhandledRejection', (err) => {
      console.log('UNHANDLED REJECTION!');

      if (err instanceof AppError) {
        console.error('AppError:', err.message);
      } else if (err instanceof Error) {
        console.error('Error:', err.name, err.message);
        console.error(err.stack);
      } else {
        console.error('Unknown rejection:', err);
      }

      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error('MongoDB not connected', err);
    process.exit(1);
  }
};

startServer();
