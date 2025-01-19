import {Department} from "@/domain/entities/department.entity";

export interface DepartmentRepository {
    create(department: Department): Promise<Department>;
    findById(id: number): Promise<Department | null>;
}