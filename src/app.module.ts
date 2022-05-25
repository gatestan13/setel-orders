import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { OrdersModule } from './orders/orders.module';
import { getMongoConfig } from './shared/mongo.helper';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => getMongoConfig(),
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
