import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import groupRoutes from './routes/groupRoutes.js';

dotenv.config({ path: './.env' });

const app = express();

const db = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB not connected', err));

const corsOptions = {
  origin: ['http://localhost:5173'],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


