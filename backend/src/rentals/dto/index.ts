import { IsNumber, IsString, IsDateString, IsArray, IsOptional, IsEnum, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RentalStatus } from '@prisma/client';

class RentalItemDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  priceAtRent: number;
}

export class CreateRentalDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RentalItemDto)
  items: RentalItemDto[];

  @IsOptional()
  @IsNumber()
  couponId?: number;
}

export class UpdateRentalStatusDto {
  @IsEnum(RentalStatus)
  status: RentalStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
