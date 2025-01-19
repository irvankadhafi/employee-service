// src/domain/usecases/employee.usecase.ts
import { Employee } from '@/domain/entities/employee.entity';

export interface EmployeeUseCase {
    createEmployee(data: { userId: number; name: string; email: string; birthDate: Date; positionId: number; departmentId: number }): Promise<Employee>;
    findEmployeeById(id: number): Promise<Employee | null>;
    updateEmployee(id: number, data: Partial<Employee>): Promise<Employee | null>;
    deleteEmployee(id: number): Promise<void>;
}