import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { UsersModule } from 'src/users/users.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessageSchema } from './schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => RoomsModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {}
