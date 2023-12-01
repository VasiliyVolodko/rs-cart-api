import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart, Orders } from './services/cart.entities';


@Module({
  imports: [TypeOrmModule.forFeature([Cart]), OrderModule ],
  providers: [ CartService ],
  controllers: [ CartController ]
})
export class CartModule {}
