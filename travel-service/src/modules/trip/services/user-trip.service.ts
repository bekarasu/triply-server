import { Injectable } from '@nestjs/common';
import { UserTripRepository } from '../database/user-trip.repository';
import { CreateUserTripDto, UserTripResponseDto } from '../dto';

@Injectable()
export class UserTripService {
  constructor(private readonly tripRepository: UserTripRepository) {}

  async create(createData: CreateUserTripDto): Promise<UserTripResponseDto> {
    const totalDurationAsDay = createData.destinations.reduce(
      (total, destination) => {
        const budget = destination.budget;
        return total + (isNaN(budget) ? 0 : budget);
      },
      0,
    );

    const tripEndDate = new Date();
    tripEndDate.setDate(tripEndDate.getDate() + totalDurationAsDay);

    const createTripData = {
      userId: createData.userId,
      tripStartDate: createData.startDate,
      tripEndDate,
    };

    const tripData = await this.tripRepository.create(createTripData);

    return tripData;
  }

  // /**
  //  * Find a user trip by ID
  //  */
  // async findById(id: string): Promise<UserTripResponseDto> {
  //   if (!id) {
  //     throw new BadRequestException('Trip ID is required');
  //   }

  //   const trip = await this.tripRepository.findByIdAsDto(id);
  //   if (!trip) {
  //     throw new NotFoundException(`User trip with ID ${id} not found`);
  //   }

  //   return trip;
  // }

  // /**
  //  * Find all user trips with optional filters
  //  */
  // async findAll(
  //   options?: FindUserTripsQueryDto,
  // ): Promise<UserTripResponseDto[]> {
  //   try {
  //     return await this.tripRepository.findAllAsDto(options);
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Failed to retrieve user trips: ${error.message}`,
  //     );
  //   }
  // }

  // /**
  //  * Find user trips by user ID
  //  */
  // async findByUserId(userId: string): Promise<UserTripResponseDto[]> {
  //   if (!userId) {
  //     throw new BadRequestException('User ID is required');
  //   }

  //   try {
  //     return await this.tripRepository.findByUserIdAsDto(userId);
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Failed to retrieve trips for user ${userId}: ${error.message}`,
  //     );
  //   }
  // }

  // /**
  //  * Update a user trip by ID
  //  */
  // async update(
  //   id: string,
  //   updateData: UpdateUserTripDto,
  // ): Promise<UserTripResponseDto> {
  //   if (!id) {
  //     throw new BadRequestException('Trip ID is required');
  //   }

  //   // Check if trip exists
  //   const existingTrip = await this.tripRepository.findById(id);
  //   if (!existingTrip) {
  //     throw new NotFoundException(`User trip with ID ${id} not found`);
  //   }

  //   try {
  //     const updatedTrip = await this.tripRepository.updateByIdAndReturnDto(
  //       id,
  //       updateData,
  //     );

  //     if (!updatedTrip) {
  //       throw new NotFoundException(`Failed to update trip with ID ${id}`);
  //     }

  //     return updatedTrip;
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new BadRequestException(
  //       `Failed to update user trip: ${error.message}`,
  //     );
  //   }
  // }

  // /**
  //  * Soft delete a user trip by ID
  //  */
  // async softDelete(id: string): Promise<{ message: string; deleted: boolean }> {
  //   if (!id) {
  //     throw new BadRequestException('Trip ID is required');
  //   }

  //   // Check if trip exists
  //   const existingTrip = await this.tripRepository.findById(id);
  //   if (!existingTrip) {
  //     throw new NotFoundException(`User trip with ID ${id} not found`);
  //   }

  //   try {
  //     const deleted = await this.tripRepository.softDeleteById(id);

  //     if (!deleted) {
  //       throw new BadRequestException(`Failed to delete trip with ID ${id}`);
  //     }

  //     return {
  //       message: `Trip with ID ${id} has been soft deleted successfully`,
  //       deleted: true,
  //     };
  //   } catch (error) {
  //     if (error instanceof BadRequestException) {
  //       throw error;
  //     }
  //     throw new BadRequestException(
  //       `Failed to delete user trip: ${error.message}`,
  //     );
  //   }
  // }

  // /**
  //  * Hard delete a user trip by ID
  //  */
  // async delete(id: string): Promise<{ message: string; deleted: boolean }> {
  //   if (!id) {
  //     throw new BadRequestException('Trip ID is required');
  //   }

  //   // Check if trip exists
  //   const existingTrip = await this.tripRepository.existsById(id);
  //   if (!existingTrip) {
  //     throw new NotFoundException(`User trip with ID ${id} not found`);
  //   }

  //   try {
  //     const deleted = await this.tripRepository.deleteById(id);

  //     if (!deleted) {
  //       throw new BadRequestException(`Failed to delete trip with ID ${id}`);
  //     }

  //     return {
  //       message: `Trip with ID ${id} has been permanently deleted`,
  //       deleted: true,
  //     };
  //   } catch (error) {
  //     if (error instanceof BadRequestException) {
  //       throw error;
  //     }
  //     throw new BadRequestException(
  //       `Failed to delete user trip: ${error.message}`,
  //     );
  //   }
  // }

  // /**
  //  * Restore a soft-deleted user trip by ID
  //  */
  // async restore(id: string): Promise<{ message: string; restored: boolean }> {
  //   if (!id) {
  //     throw new BadRequestException('Trip ID is required');
  //   }

  //   try {
  //     const restored = await this.tripRepository.restoreById(id);

  //     if (!restored) {
  //       throw new NotFoundException(
  //         `No soft-deleted trip found with ID ${id} to restore`,
  //       );
  //     }

  //     return {
  //       message: `Trip with ID ${id} has been restored successfully`,
  //       restored: true,
  //     };
  //   } catch (error) {
  //     if (error instanceof NotFoundException) {
  //       throw error;
  //     }
  //     throw new BadRequestException(
  //       `Failed to restore user trip: ${error.message}`,
  //     );
  //   }
  // }

  // /**
  //  * Count user trips with optional filters
  //  */
  // async count(options?: CountUserTripsDto): Promise<{ count: number }> {
  //   try {
  //     const count = await this.tripRepository.count(options);
  //     return { count };
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Failed to count user trips: ${error.message}`,
  //     );
  //   }
  // }

  // /**
  //  * Check if a user trip exists by ID
  //  */
  // async exists(id: string): Promise<{ exists: boolean }> {
  //   if (!id) {
  //     throw new BadRequestException('Trip ID is required');
  //   }

  //   try {
  //     const exists = await this.tripRepository.existsById(id);
  //     return { exists };
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Failed to check trip existence: ${error.message}`,
  //     );
  //   }
  // }

  // /**
  //  * Find user trips by date range
  //  */
  // async findByDateRange(
  //   queryDto: FindTripsByDateRangeDto,
  // ): Promise<UserTripResponseDto[]> {
  //   if (!queryDto.startDate || !queryDto.endDate) {
  //     throw new BadRequestException(
  //       'Both startDate and endDate are required for date range queries',
  //     );
  //   }

  //   // Validate date format
  //   const startDate = new Date(queryDto.startDate);
  //   const endDate = new Date(queryDto.endDate);

  //   if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
  //     throw new BadRequestException(
  //       'Invalid date format. Please use ISO 8601 format (YYYY-MM-DD)',
  //     );
  //   }

  //   if (startDate > endDate) {
  //     throw new BadRequestException('Start date cannot be after end date');
  //   }

  //   try {
  //     return await this.tripRepository.findByDateRangeAsDto(queryDto);
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Failed to retrieve trips by date range: ${error.message}`,
  //     );
  //   }
  // }

  // /**
  //  * Get paginated user trips
  //  */
  // async findPaginated(
  //   page: number = 1,
  //   limit: number = 10,
  //   userId?: string,
  // ): Promise<{
  //   trips: UserTripResponseDto[];
  //   total: number;
  //   page: number;
  //   limit: number;
  //   totalPages: number;
  // }> {
  //   if (page < 1) {
  //     throw new BadRequestException('Page number must be greater than 0');
  //   }

  //   if (limit < 1 || limit > 100) {
  //     throw new BadRequestException('Limit must be between 1 and 100');
  //   }

  //   const offset = (page - 1) * limit;

  //   try {
  //     const [trips, total] = await Promise.all([
  //       this.tripRepository.findAllAsDto({
  //         userId,
  //         limit,
  //         offset,
  //       }),
  //       this.tripRepository.count({ userId }),
  //     ]);

  //     const totalPages = Math.ceil(total / limit);

  //     return {
  //       trips,
  //       total,
  //       page,
  //       limit,
  //       totalPages,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(
  //       `Failed to retrieve paginated trips: ${error.message}`,
  //     );
  //   }
  // }
}
