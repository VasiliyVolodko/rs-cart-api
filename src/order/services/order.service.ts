import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from 'src/cart/services/cart.entities';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
  ) { }

  async findById(orderId: string): Promise<Orders> {
    return await this.ordersRepository.findOne({
      where: {
        id: orderId
      },
      relations: {
        cart: true
      }
    })
  }

  async create(data: any) {
    const id = v4(v4())

    await this.ordersRepository.insert({
      ...data,
      id,
      status: 'inProgress',
    })

    return await this.findById(id)
  }

  async update(orderId, data) {
    const order = await this.findById(orderId);

    if (!order) {
      throw new Error('Order does not exist.');
    }
    await this.ordersRepository.update({ id: orderId }, {
      ...data,
      id: orderId,
    })
  }
}
