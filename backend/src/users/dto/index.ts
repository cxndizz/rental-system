import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}

export class UpdateKYCDto {
  @IsOptional()
  @IsString()
  idCardNumber?: string;

  @IsOptional()
  @IsString()
  idCardUrl?: string;

  @IsOptional()
  @IsString()
  selfieUrl?: string;
}

export class CreateAddressDto {
  @IsString()
  addressLine: string;

  @IsString()
  city: string;

  @IsString()
  province: string;

  @IsString()
  postalCode: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
