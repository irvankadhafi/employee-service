import { inject, injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import {PositionRepository} from "@/domain/repositories/position.repository";
import {Position} from "@/domain/entities/position.entity";

@injectable()
export class PositionRepositoryImpl implements PositionRepository {
    private repository: Repository<Position>;

    constructor(@inject('DataSource') private dataSource: DataSource) {
        this.repository = dataSource.getRepository(Position);
    }

    async create(position: Position): Promise<Position> {
        return await this.repository.save(position);
    }

    async findById(id: number): Promise<Position | null> {
        return await this.repository.findOneBy({ id });
    }
}