import { Controller, Get, Delete, Put, Body, Req, Post, UseGuards, HttpStatus } from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const userId = req.query.user.toString() || ''
    const cart = await this.cartService.findOrCreateByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart },
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) { // TODO: validate body payload...
    const userId = req.query.user.toString() || ''

    const cart = await this.cartService.updateByUserId(userId, body)

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart
      }
    }
  }

  // // @UseGuards(JwtAuthGuard)
  // // @UseGuards(BasicAuthGuard)
  @Delete()
  async clearUserCart(@Req() req: AppRequest) {
    const userId = req.query.user.toString() || ''

    await this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  // // @UseGuards(JwtAuthGuard)
  // // @UseGuards(BasicAuthGuard)
  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    const userId = req.query.user.toString() || ''
    console.log(req.query)
    const cart = await this.cartService.findByUserId(userId);
    console.log(cart)
    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { id: cartId } = cart;
    const total = await calculateCartTotal(cart);
    console.log(total)
    const order = await this.orderService.create({
      ...body, // TODO: validate and pick only necessary data
      user_id: userId,
      cart_id: cartId,
      total
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
