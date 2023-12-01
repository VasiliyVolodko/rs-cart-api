import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToMany, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

enum CartStatuses {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED',
}

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @CreateDateColumn({ type: 'date', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'date', nullable: false })
  updated_at: Date;

  @Column({
    type: 'enum',
    default: CartStatuses.OPEN,
    nullable: false,
    enum: CartStatuses
  })
  status: CartStatuses;

  @OneToMany(
    () => CartItem,
    cartItem => cartItem.cart,
  )
  items: CartItem[];
}

@Entity('cart_items')
export class CartItem {
  @PrimaryColumn('uuid')
  cart_id: string;

  @PrimaryColumn({ type: 'uuid', nullable: false })
  product_id: string;

  @Column({ type: 'integer', default: 0 })
  count: number;

  @ManyToOne(
    () => Cart,
    cart => cart.items
  )
  @JoinColumn({ name: "cart_id" })
  cart: Cart;
}

@Entity('orders')
export class Orders {
  @PrimaryColumn({ type: 'uuid', nullable: false })
  id: string;

  @PrimaryColumn({ type: 'uuid', nullable: false })
  cart_id: string;

  @PrimaryColumn({ type: 'uuid', nullable: false })
  user_id: string;

  @Column('json')
  payment: JSON

  @Column('json')
  delivery: JSON

  @Column('varchar')
  comments: string

  @Column('varchar')
  status: string

  @Column('integer')
  total: number

  @ManyToOne(
    () => Cart,
    cart => cart.items
  )
  @JoinColumn({ name: "cart_id" })
  cart: Cart;
}
