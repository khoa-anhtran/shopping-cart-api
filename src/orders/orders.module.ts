import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { AuthStrategyModule } from 'src/auth-strategy/auth-stategy.module';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema },
        ]),
        AuthStrategyModule,
        UsersModule
    ],
    providers: [OrdersService],
    controllers: [OrdersController],
})
export class OrderModule { }
