import { IsCreditCard, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  exp_month: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  exp_year: number;

  @IsNotEmpty()
  @IsCreditCard()
  number: string;
}
