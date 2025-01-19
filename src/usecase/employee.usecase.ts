// src/usecase/employee.usecase.ts
import { inject, injectable } from 'tsyringe';
import { EmployeeRepository } from '@/domain/repositories/employee.repository';
import { Employee } from '@/domain/entities/employee.entity';
import {EmployeeUseCase} from "@/domain/usecases";
import {AuthServiceClientWrapper} from "@/infrastructure/grpc/authServiceClient";
import {FindByIdRequest} from "@/proto/auth_service_pb";

@injectable()
export class EmployeeUseCaseImpl implements EmployeeUseCase {
    constructor(
        @inject('EmployeeRepository') private employeeRepo: EmployeeRepository,
        @inject('AuthServiceClientWrapper') private authServiceClient: AuthServiceClientWrapper
        ) {}

    async createEmployee(data: { userId: number; name: string; email: string; birthDate: Date; positionId: number; departmentId: number }): Promise<Employee> {
        const employee = new Employee();
        employee.userId = data.userId;
        employee.name = data.name;
        employee.email = data.email;
        employee.birthDate = data.birthDate;
        // employee.positionId = data.positionId;
        // employee.departmentId = data.departmentId;

        return await this.employeeRepo.create(employee);
    }

    async findEmployeeById(id: number): Promise<Employee | null> {
        const request = new FindByIdRequest();
        request.setId(7);
        this.authServiceClient.findById(request, (error, response) => {
            if (error) {
                console.error('Error calling gRPC method:', error);
            } else {
                console.log('gRPC response:', response.toString());
                // response.toString()
            }
        });

        return await this.employeeRepo.findById(id);
    }

    async updateEmployee(id: number, data: Partial<Employee>): Promise<Employee | null> {
        return await this.employeeRepo.update(id, data);
    }

    async deleteEmployee(id: number): Promise<void> {
        await this.employeeRepo.delete(id);
    }
}