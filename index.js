import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import 'express-async-errors';
import { setupProductRoutes } from './productController.js';
import { setupOrderRoutes } from './orderController.js';
import { setupCartRoutes } from './cartController.js';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  // Массив адресов на которых может быть фронтэнд часть
  origin: [
    'http://localhost:5173',
    'https://mirano.rootdiv.ru',
    'https://mirano-react.rootdiv.ru',
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use('/img', express.static('img'));

// Read the Swagger JSON file
const swaggerDocument = JSON.parse(readFileSync('./docs/swagger.json', 'utf8'));

// Middleware для документации API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

setupProductRoutes(app);
setupOrderRoutes(app);
setupCartRoutes(app);

// Запускаем сервер, чтобы порт был доступен только из локальной сети
app.listen(PORT, 'localhost', () => {
  if (process.env.PROD !== 'true') {
    console.log(`Server is running http://localhost:${PORT}`);
  }
});
