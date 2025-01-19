import { Router } from 'express';
import { container } from 'tsyringe';
import {EmployeeHandler} from "@/delivery/http/handlers/employee.handler";
import {requestLogger} from "@/delivery/http/middlewares/request.logger";

export const employeeRouter = Router();

// Delay resolving UserHandler until the container is ready
const getEmployeeHandler = () => container.resolve(EmployeeHandler);

employeeRouter.get('/:id', (req, res,next) => getEmployeeHandler().findUserById(req, res,next));
employeeRouter.post('/:id', (req, res,next) => getEmployeeHandler().findUserById(req, res,next));