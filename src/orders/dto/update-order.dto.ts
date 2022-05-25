import { PartialType, PickType } from '@nestjs/mapped-types';
import { OrderDto } from './order.dto';

export class UpdateOrderDto extends PartialType(
  PickType(OrderDto, ['name', 'description', 'state'] as const),
) {}
