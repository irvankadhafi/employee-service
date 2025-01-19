// src/domain/repositories/employee.repository.ts
import { Employee } from '../entities/employee.entity';

export interface EmployeeRepository {
    create(employee: Employee): Promise<Employee>;
    findById(id: number): Promise<Employee | null>;
    update(id: number, employeeData: Partial<Employee>): Promise<Employee | null>;
    delete(id: number): Promise<void>;
}