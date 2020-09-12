import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './rooms/rooms.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false', { useNewUrlParser: true }),
    RoomsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
