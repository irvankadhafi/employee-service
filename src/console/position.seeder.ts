// src/console/position.seeder.ts
import 'reflect-metadata';
import { Command } from 'commander';
import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { Logger } from '@/utils/logger';
import { Config } from '@/config';
import { PositionRepository } from '@/domain/repositories/position.repository';
import { Position } from '@/domain/entities/position.entity';
import { setupContainer } from './server';
import Redis from 'ioredis';

export const positionSeederCommand = new Command('seed:position')
    .description('Seed default positions for testing')
    .action(async () => {
        console.log('positionSeederCommand is running...');
        try {
            Logger.info('Starting position seeder...');

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

            // Resolve PositionRepository
            const positionRepo = container.resolve<PositionRepository>('PositionRepository');

            // Define positions to seed
            const positionsToSeed = [
                { title: 'Software Engineer' },
                { title: 'Product Manager' },
                { title: 'Sales Executive' },
                { title: 'Marketing Specialist' }
            ];

            // Seed positions
            for (const positionData of positionsToSeed) {
                const position = new Position();
                position.name = positionData.title;

                try {
                    await positionRepo.create(position);
                    Logger.info(`Seeded position: ${positionData.title}`);
                } catch (error) {
                    Logger.warn(`Position ${positionData.title} might already exist:`, error);
                }
            }

            Logger.info('Position seeder completed successfully!');

            // Cleanup connections
            await redis.quit();
            await dataSource.destroy();
            process.exit(0);
        } catch (error) {
            Logger.error('Position seeder failed:', error);
            process.exit(1);
        }
    });