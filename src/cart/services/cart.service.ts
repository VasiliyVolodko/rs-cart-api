import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './cart.entities';
import { Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) { }
  async findByUserId(userId: string): Promise<Cart> {
    return await this.cartRepository.findOne({
      where: {
        id: userId
      },
      relations: {
        items: true
      }
    });
  }

  async createByUserId(userId: string) {
    const id = v4(v4());
    const userCart = await this.cartRepository.insert({
      id, user_id: userId, items: []
    })

    return userCart;
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId)

    if (userCart) {
      return userCart;
    }

    await this.createByUserId(userId);
    return await this.findByUserId(userId)
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [ ...items ],
    }

    await this.cartRepository.update({ id }, updatedCart)

    return await this.findByUserId(userId)
  }

  async removeByUserId(userId: string): Promise<void> {
    await this.cartRepository.delete({ user_id: userId })
  }

}
