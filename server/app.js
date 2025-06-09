import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import userRoutes from './routes/userRoutes.js';
import errorController from './controllers/errorController.js';

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', userRoutes);
// app.use('/api/groups', groupRoutes);

app.use(errorController);

export default app;
