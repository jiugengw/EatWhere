import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from './utils/config.js';
import app from './app.js';

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!');
    console.log(err.name, err.message);
    process.exit(1);
  });
  
dotenv.config({ path: './.env' });

const db = config.DATABASE.replace(
  '<db_password>',
  config.DATABASE_PASSWORD
);

mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB not connected', err));

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
