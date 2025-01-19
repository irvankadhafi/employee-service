import express from 'express';
import { createServer } from 'http';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import Redis from 'ioredis';
import { Logger } from '@/utils/logger';
import { Config } from '@/config';
import { setupRoutes } from '@/delivery/http/routes';
import * as grpc from '@grpc/grpc-js';

import {EmployeeRepositoryImpl} from "@/repository/employee.repository";
import {EmployeeRepository} from "@/domain/repositories/employee.repository";
import {EmployeeUseCaseImpl} from "@/usecase/employee.usecase";
import {EmployeeUseCase} from "@/domain/usecases";

import { AuthServiceClientWrapper } from '@/infrastructure/grpc/authServiceClient';
import {DepartmentRepository} from "@/domain/repositories/department.repository";
import {DepartmentRepositoryImpl} from "@/repository/department.repository";
import {PositionRepository} from "@/domain/repositories/position.repository";
import {PositionRepositoryImpl} from "@/repository/position.repository";

export class Server {
    private readonly httpServer: express.Application;
    private dataSource!: DataSource;
    private redis!: Redis;
    private logger: typeof Logger;

    constructor() {
        this.httpServer = express();
        this.logger = Logger;
    }

    async initialize(): Promise<void> {
        await this.setupDatabase();
        await this.setupRedis();
        await setupContainer(this.dataSource, this.redis);
        // this.authServiceClient = new AuthServiceClient('localhost:50051', grpc.credentials.createInsecure());
    }

    private async setupDatabase(): Promise<void> {
        this.dataSource = new DataSource({
            type: 'postgres',
            url: Config.DATABASE_URL,
            entities: ['src/domain/entities/*.entity.ts'],
            synchronize: false,
            logging: true
        });

        await this.dataSource.initialize();
        this.logger.info('Database connected successfully');
    }

    private async setupRedis(): Promise<void> {
        this.redis = new Redis(Config.REDIS_URL);
        this.logger.info('Redis connected successfully');
    }

    async start(): Promise<void> {
        await this.initialize();

        // Setup delivery methods
        await Promise.all([
            this.setupHttp(),
        ]);

        this.setupGracefulShutdown();
    }

    private async setupHttp(): Promise<void> {
        const httpPort = Config.HTTP_PORT;

        this.httpServer.use(express.json());
        setupRoutes(this.httpServer);

        return new Promise((resolve) => {
            const server = this.httpServer.listen(httpPort, () => {
                this.logger.info(`HTTP Server running on port ${httpPort}`);
                resolve();
            });

            // HTTP Graceful shutdown
            process.on('SIGTERM', () => {
                this.logger.info('SIGTERM received. Shutting down HTTP server...');
                server.close(() => {
                    this.logger.info('HTTP server closed');
                });
            });
        });
    }

    private setupGracefulShutdown(): void {
        const shutdown = async () => {
            this.logger.info('Shutting down...');

            try {
                // Shutdown Redis
                await this.redis.quit();
                this.logger.info('Redis connection closed');

                // Shutdown database
                await this.dataSource.destroy();
                this.logger.info('Database connection closed');

                // Exit the process
                process.exit(0);
            } catch (error) {
                this.logger.error('Error during shutdown:', error);
                process.exit(1);
            }
        };

        // Handle SIGTERM and SIGINT signals
        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
    }
}

export async function setupContainer(dataSource: DataSource, redis: Redis): Promise<void> {
    container.reset();

    // Register instances
    container.registerInstance('DataSource', dataSource);
    container.registerInstance('Redis', redis);
    container.registerInstance('Logger', Logger);

    // Register repositories and use cases
    container.registerSingleton<EmployeeRepository>('EmployeeRepository', EmployeeRepositoryImpl);
    container.registerSingleton<DepartmentRepository>('DepartmentRepository', DepartmentRepositoryImpl);
    container.registerSingleton<PositionRepository>('PositionRepository', PositionRepositoryImpl);
    container.registerSingleton<EmployeeUseCase>('EmployeeUseCase', EmployeeUseCaseImpl);
    container.registerSingleton<AuthServiceClientWrapper>('AuthServiceClientWrapper', AuthServiceClientWrapper);
}