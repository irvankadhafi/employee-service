// src/console/department.seeder.ts
import 'reflect-metadata';
import { Command } from 'commander';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { Logger } from '@/utils/logger';
import { Config } from '@/config';
import { DepartmentRepository } from '@/domain/repositories/department.repository';
import { DepartmentRepositoryImpl } from '@/repository/department.repository';
import { Department } from '@/domain/entities/department.entity';
import { setupContainer } from './server';
import Redis from 'ioredis';

export const departmentSeederCommand = new Command('seed:department')
    .description('Seed default departments for testing')
    .action(async () => {
        console.log('departmentSeederCommand is running...');
        try {
            Logger.info('Starting department seeder...');

            // Initialize database connection
            const dataSource = new DataSource({
                type: 'postgres',
                url: Config.DATABASE_URL,
                entities: ['src/domain/entities/*.entity.ts'],
                synchronize: false,
                logging: true
            });

            await dataSource.initialize();
            Logger.info('Database connected successfully');

            // Initialize Redis
            const redis = new Redis(Config.REDIS_URL);
            Logger.info('Redis connected successfully');

            // Setup dependency injection
            await setupContainer(dataSource, redis);

            // Resolve DepartmentRepository
            const departmentRepo = container.resolve<DepartmentRepository>('DepartmentRepository');

            // Define departments to seed
            const departmentsToSeed = [
                { name: 'Human Resources' },
                { name: 'Engineering' },
                { name: 'Sales' },
                { name: 'Marketing' }
            ];

            // Seed departments
            for (const departmentData of departmentsToSeed) {
                const department = new Department();
                department.name = departmentData.name;

                try {
                    await departmentRepo.create(department);
                    Logger.info(`Seeded department: ${departmentData.name}`);
                } catch (error) {
                    Logger.warn(`Department ${departmentData.name} might already exist:`, error);
                }
            }

            Logger.info('Department seeder completed successfully!');

            // Cleanup connections
            await redis.quit();
            await dataSource.destroy();
            process.exit(0);
        } catch (error) {
            Logger.error('Department seeder failed:', error);
            process.exit(1);
        }
    });