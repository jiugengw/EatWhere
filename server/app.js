import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes/index.js';
import errorController from './controllers/errorController.js';

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', router);

app.use(errorController);

export default app;
