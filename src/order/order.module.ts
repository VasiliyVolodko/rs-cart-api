import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from 'src/cart/services/cart.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Orders])],
  providers: [ OrderService ],
  exports: [ OrderService ]
})
export class OrderModule {}
