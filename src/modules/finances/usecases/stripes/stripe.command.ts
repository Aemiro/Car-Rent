import { ApiProperty } from '@nestjs/swagger';

export class CreateCheckoutSessionCommand {
  @ApiProperty()
  amount: number = 20;
  @ApiProperty()
  currency: string = 'PLN';
  @ApiProperty()
  productId: string = 'prod_SBs2TAP6RtU6la'; // Product ID can be used for better data management
  @ApiProperty()
  quantity: number = 1;
}