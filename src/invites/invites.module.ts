import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';
import { InviteSchema } from './schemas/invite.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Invite', schema: InviteSchema }]),
    forwardRef(() => RoomsModule),
    forwardRef(() => AuthModule)
  ],
  controllers: [InvitesController],
  providers: [InvitesService],
  exports: [InvitesService]
})
export class InvitesModule {}
