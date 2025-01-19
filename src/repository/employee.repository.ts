// src/repository/employee.repository.ts
import { inject, injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { Employee } from '@/domain/entities/employee.entity';
import { EmployeeRepository } from '@/domain/repositories/employee.repository';

@injectable()
export class EmployeeRepositoryImpl implements EmployeeRepository {
    private repository: Repository<Employee>;

    constructor(@inject('DataSource') private dataSource: DataSource) {
        this.repository = dataSource.getRepository(Employee);
    }

    async create(employee: Employee): Promise<Employee> {
        return await this.repository.save(employee);
    }

    async findById(id: number): Promise<Employee | null> {
        return await this.repository.findOneBy({ id });
    }

    async update(id: number, employeeData: Partial<Employee>): Promise<Employee | null > {
        await this.repository.update(id, employeeData);
        return await this.findById(id)!;
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}