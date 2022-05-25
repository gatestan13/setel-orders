import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto, PaymentStatus } from './dto/order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ORDER_CREATE_ALREADY_EXISTS,
  ORDER_NOT_FOUND,
  ORDER_UPDATE_ORDERKEY_NOT_FOUND,
} from './orders.errors';
import { OrderDocument, Orders, OrderState } from './orders.schema';
import { isMongoId } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { getJwtConfig } from '../shared/jwt.helper';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name)
    private ordersModel: Model<OrderDocument>,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async createOrder(orderDto: CreateOrderDto): Promise<OrderDto> {
    const alreadyExists = await this.ordersModel
      .findOne({ orderKey: orderDto.orderKey })
      .lean();
    if (alreadyExists) {
      throw new ConflictException(ORDER_CREATE_ALREADY_EXISTS);
    }

    const order = await this.ordersModel.create({
      ...orderDto,
      state: OrderState.CREATED,
    });

    const payload = {
      username: 'gates.tan',
      sub: '1234567890',
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '5m',
      secret: getJwtConfig().secret,
    });

    const headers = {
      access_token: access_token,
    };

    console.log(headers);

    //TODO Change to localhost
    const response = await axios.post(
      'http://192.168.1.131:3333/payments/process',
      { orderKey: orderDto.orderKey },
      {
        headers,
      },
    );

    console.log(response.data);

    if (response.data.status === PaymentStatus.CONFIRMED) {
      await this.updateOrderStatus(order._id, OrderState.CONFIRMED);
      setTimeout(() => {
        this.updateOrderStatus(order._id, OrderState.DELIVERED);
      }, 10000);
    }

    if (response.data.stats === PaymentStatus.DECLINED) {
      await this.updateOrderStatus(order._id, OrderState.CANCELLED);
    }

    return order;
  }

  async getAllOrders() {
    const allOrders = await this.ordersModel.find();
    return allOrders;
  }

  async getOrder(id: string): Promise<OrderDto> {
    if (!id || !isMongoId(id)) {
      throw new BadRequestException('id should match format /^[a-f\\d]{24}$/i');
    }

    const order = await this.ordersModel.findById(id);

    if (!order) {
      throw new NotFoundException(ORDER_NOT_FOUND);
    }

    return order;
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.ordersModel.findById(id);

    if (!order) {
      throw new BadRequestException(ORDER_UPDATE_ORDERKEY_NOT_FOUND);
    }

    await order.updateOne({
      $set: {
        ...updateOrderDto,
      },
    });

    return this.getOrder(id);
  }

  async updateOrderStatus(id: string, status: OrderState) {
    const order = await this.ordersModel.findById(id);

    await order.updateOne({
      $set: {
        state: status,
      },
    });
  }
}
