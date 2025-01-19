import { Position } from '../entities/position.entity';

export interface PositionRepository {
    create(position: Position): Promise<Position>;
    findById(id: number): Promise<Position | null>;
}