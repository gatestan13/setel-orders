import { HttpStatus } from '@nestjs/common';

export const ORDER_CREATE_ALREADY_EXISTS = {
  statusCode: HttpStatus.CONFLICT,
  message: 'order with provided orderKey already exists',
};

export const ORDER_NOT_FOUND = {
  statusCode: HttpStatus.NOT_FOUND,
  message: 'order not found',
};

export const ORDER_UPDATE_ORDERKEY_NOT_FOUND = {
  statusCode: HttpStatus.BAD_REQUEST,
  message: `order doesn't exist`,
};
