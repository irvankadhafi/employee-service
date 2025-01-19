// src/usecase/employee.usecase.ts
import { inject, injectable } from 'tsyringe';
import { EmployeeRepository } from '@/domain/repositories/employee.repository';
import { Employee } from '@/domain/entities/employee.entity';
import {EmployeeUseCase} from "@/domain/usecases";
import {AuthServiceClientWrapper} from "@/infrastructure/grpc/authServiceClient";
import {FindByIdRequest} from "@/proto/auth_service_pb";
import {Position} from "@/domain/entities/position.entity";
import {PositionRepository} from "@/domain/repositories/position.repository";
import {DepartmentRepository} from "@/domain/repositories/department.repository";
import {CreateUserRequest, FindUserByEmailRequest, User} from "@/proto/user_pb";

@injectable()
export class EmployeeUseCaseImpl implements EmployeeUseCase {
    constructor(
        @inject('EmployeeRepository') private employeeRepo: EmployeeRepository,
        @inject('PositionRepository') private positionRepo: PositionRepository,
        @inject('DepartmentRepository') private departmentRepo: DepartmentRepository,
        @inject('AuthServiceClientWrapper') private authServiceClient: AuthServiceClientWrapper
        ) {}

    async createEmployee(data: { userId: number; name: string; email: string; birthDate: Date; positionId: number; departmentId: number }): Promise<Employee> {
        const findUserRequest = new FindUserByEmailRequest();
        findUserRequest.setEmail(data.email);

        return new Promise((resolve, reject) => {
            this.authServiceClient.findUserByEmail(findUserRequest, async (error, response) => {
                if (error) {
                    console.error('Error calling findUserByEmail gRPC method:', error);
                    return reject(new Error('Error checking user existence'));
                }

                // If user does not exist, create the user
                if (!response) {
                    const createUserRequest = new CreateUserRequest();
                    const user = new User();
                    user.setEmail(data.email);
                    user.setRole('EMPLOYEE');

                    createUserRequest.setBody(user);
                    createUserRequest.setUserId(data.userId); // Assuming userId is passed for the new user

                    this.authServiceClient.createUser(createUserRequest, async (createError, createResponse) => {
                        if (createError) {
                            console.error('Error calling createUser gRPC method:', createError);
                            return reject(new Error('Error creating user'));
                        }

                        // Proceed to create the employee record
                        const position = await this.positionRepo.findById(data.positionId);
                        const department = await this.departmentRepo.findById(data.departmentId);

                        if (!position) {
                            return reject(new Error(`Position with ID ${data.positionId} not found`));
                        }

                        if (!department) {
                            return reject(new Error(`Department with ID ${data.departmentId} not found`));
                        }

                        // Create a new employee instance
                        const employee = new Employee();
                        employee.name = data.name;
                        employee.email = data.email;
                        employee.birthDate = data.birthDate;
                        employee.position = position; // Set the position
                        employee.department = department; // Set the department

                        // Save the employee to the database
                        const savedEmployee = await this.employeeRepo.create(employee);
                        resolve(savedEmployee);
                    });
                } else {
                    // User already exists
                    return reject(new Error(`User with email ${data.email} already exists`));
                }
            });
        });
    }

    async findEmployeeById(id: number): Promise<Employee | null> {
        const request = new FindByIdRequest();
        request.setId(7);
        this.authServiceClient.findUserById(request, (error, response) => {
            if (error) {
                console.error('Error calling gRPC method:', error);
            } else {
                console.log('gRPC response:', {response});
                console.log('gRPC response object:', response?.toObject().role);
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