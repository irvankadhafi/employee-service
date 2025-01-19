// src/domain/entities/employee.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn, DeleteDateColumn
} from 'typeorm';
import { Position } from './position.entity';
import { Department } from './department.entity';

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    userId!: number; // Menyimpan user_id dari auth-service

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ type: 'date' })
    birthDate!: Date;

    @ManyToOne(() => Position, { eager: true })
    @JoinColumn({ name: 'position_id' })
    position!: Position;

    @ManyToOne(() => Department, { eager: true })
    @JoinColumn({ name: 'department_id' })
    department!: Department;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
    deletedAt?: Date;
}