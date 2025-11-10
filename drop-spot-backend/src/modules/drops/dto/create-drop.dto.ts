import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateDropDto {
  @IsNotEmpty() @IsString() title: string;
  @IsOptional() @IsString() description?: string;
  @IsNotEmpty() @IsDateString() startAt: string;
  @IsOptional() @IsDateString() endAt?: string;
}
