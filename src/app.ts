import express, {Application} from "express" ;
//import {authenticateKey} from './middleware/auth.middleware';
import { swaggerSpec } from "./config/swagger";
import swaggerUi from 'swagger-ui-express';
import reviewRoutes from './routes/reviews';
import userRoutes from './routes/users';


export const app: Application = express();

app.use(express.json());
app.get("/ping", (_req, res) => {
    res.status(200).json({ message: "Hello from Restaurant Reviews API!" });
});
app.use('/api/v1/reviews', /*authenticateKey*/ reviewRoutes);
app.use('/api/v1/users', /*authenticateKey*/ userRoutes);
app.use((req, _res, next) => {  
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.use(
'/api-docs',
swaggerUi.serve,
swaggerUi.setup(swaggerSpec)
);