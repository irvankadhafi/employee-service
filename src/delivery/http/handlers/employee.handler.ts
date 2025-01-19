import {NextFunction, Request, Response} from 'express';
import {inject, injectable} from 'tsyringe';
import {EmployeeUseCase} from "@/domain/usecases/employee.usecase";

@injectable()
export class EmployeeHandler {
    constructor(
        @inject('EmployeeUseCase') private employeeUseCase: EmployeeUseCase
    ) {}


    async findUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = parseInt(req.params.id, 10);
            const user = await this.employeeUseCase.findEmployeeById(userId);

            res.status(200).json({
                status: 'success',
                data: {
                    user: user
                }
            });
        } catch (error) {
            next(error);
        }
    }
}