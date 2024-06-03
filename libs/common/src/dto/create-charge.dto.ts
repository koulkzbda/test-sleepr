import { Type } from 'class-transformer';
import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { CardDto } from './card.dto';

export class CreateChargeDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  amount: number;
}
