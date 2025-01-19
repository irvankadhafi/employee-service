import { inject, injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import {DepartmentRepository} from "@/domain/repositories/department.repository";
import {Department} from "@/domain/entities/department.entity";

@injectable()
export class DepartmentRepositoryImpl implements DepartmentRepository {
    private repository: Repository<Department>;

    constructor(@inject('DataSource') private dataSource: DataSource) {
        this.repository = dataSource.getRepository(Department);
    }

    async create(department: Department): Promise<Department> {
        return await this.repository.save(department);
    }

    async findById(id: number): Promise<Department | null> {
        return await this.repository.findOneBy({ id });
    }
}