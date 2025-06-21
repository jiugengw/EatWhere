import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import router from './routes.js';
import errorHandler from './utils/errorHandler.js';
import { swaggerUi, swaggerSpec } from './swagger.js'; 

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const corsOptions = {
  origin: ['http://localhost:5173'],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', router);

app.use(errorHandler);

export default app;
