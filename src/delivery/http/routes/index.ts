// src/delivery/http/routes/index.ts
import { Router } from 'express';
import { errorHandler } from '../middlewares/error.handler';
import { requestLogger } from '../middlewares/request.logger';
import {employeeRouter} from "@/delivery/http/routes/employee.route";

export const setupRoutes = (app: Router): void => {
    // Middlewares
    app.use(requestLogger);

    // Routes
    app.use('/api/v1/employee', employeeRouter);

    // Error Handler
    app.use(errorHandler);
};