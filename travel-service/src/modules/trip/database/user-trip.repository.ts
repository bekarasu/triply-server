import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository, FindOptionsWhere } from 'typeorm';
import { UserTripEntity } from './entities/user-trip.entity';

@Injectable()
export class UserTripRepository {
  constructor(
    @InjectRepository(UserTripEntity)
    private readonly repository: Repository<UserTripEntity>,
  ) {}

  /**
   * Create a new user trip
   */
  async create(createData: Partial<UserTripEntity>): Promise<UserTripEntity> {
    const entity = new UserTripEntity({
      ...createData,
      tripStartDate: new Date(createData.tripStartDate),
      tripEndDate: new Date(createData.tripEndDate),
    });
    return this.repository.save(entity);
  }

  /**
   * Find a user trip by ID
   */
  async findById(id: string): Promise<UserTripEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['routes'],
    });
  }

  /**
   * Find all user trips with optional filters
   */
  async findAll(options?: any): Promise<UserTripEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('trip');

    if (options?.userId) {
      queryBuilder.where('trip.userId = :userId', { userId: options.userId });
    }

    if (options?.limit) {
      queryBuilder.limit(options.limit);
    }

    if (options?.offset) {
      queryBuilder.offset(options.offset);
    }

    queryBuilder.leftJoinAndSelect('trip.routes', 'routes');
    queryBuilder.orderBy('trip.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  /**
   * Find user trips by user ID
   */
  async findByUserId(userId: string): Promise<UserTripEntity[]> {
    return this.repository.find({
      where: { userId },
      relations: ['routes'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Update a user trip by ID
   */
  async updateById(
    id: string,
    updateData: Partial<UserTripEntity>,
  ): Promise<UserTripEntity | null> {
    const updatePayload: Partial<UserTripEntity> = {
      updatedAt: new Date(),
    };

    // Copy only the provided fields and convert date strings to Date objects
    if (updateData.name !== undefined) {
      updatePayload.name = updateData.name;
    }
    if (updateData.tripStartDate !== undefined) {
      updatePayload.tripStartDate = new Date(updateData.tripStartDate);
    }
    if (updateData.tripEndDate !== undefined) {
      updatePayload.tripEndDate = new Date(updateData.tripEndDate);
    }
    if (updateData.metadata !== undefined) {
      updatePayload.metadata = updateData.metadata;
    }

    const result = await this.repository.update(id, updatePayload);

    if (result.affected === 0) {
      return null;
    }

    return this.findById(id);
  }

  /**
   * Soft delete a user trip by ID
   */
  async softDeleteById(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected > 0;
  }

  /**
   * Hard delete a user trip by ID
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  /**
   * Count user trips with optional filters
   */
  async count(options?: any): Promise<number> {
    const where: FindOptionsWhere<UserTripEntity> = {};

    if (options?.userId) {
      where.userId = options.userId;
    }

    return this.repository.count({ where });
  }

  /**
   * Check if a user trip exists by ID
   */
  async existsById(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  /**
   * Find user trips by date range
   */
  async findByDateRange(queryDto: any): Promise<UserTripEntity[]> {
    const queryBuilder = this.repository.createQueryBuilder('trip');

    if (queryDto.startDate && queryDto.endDate) {
      const startDate = new Date(queryDto.startDate);
      const endDate = new Date(queryDto.endDate);

      queryBuilder.where(
        '(trip.tripStartDate >= :startDate AND trip.tripStartDate <= :endDate) OR ' +
          '(trip.tripEndDate >= :startDate AND trip.tripEndDate <= :endDate) OR ' +
          '(trip.tripStartDate <= :startDate AND trip.tripEndDate >= :endDate)',
        { startDate, endDate },
      );
    }

    if (queryDto.userId) {
      queryBuilder.andWhere('trip.userId = :userId', {
        userId: queryDto.userId,
      });
    }

    queryBuilder.leftJoinAndSelect('trip.routes', 'routes');
    queryBuilder.orderBy('trip.tripStartDate', 'ASC');

    return queryBuilder.getMany();
  }

  /**
   * Restore a soft-deleted user trip by ID
   */
  async restoreById(id: string): Promise<boolean> {
    const result = await this.repository.restore(id);
    return result.affected > 0;
  }
}
