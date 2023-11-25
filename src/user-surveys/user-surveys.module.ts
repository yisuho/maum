import { Module } from '@nestjs/common';
import { UserSurveysService } from './user-surveys.service';
import { UserSurveysResolver } from './user-surveys.resolver';
import { databaseModule } from 'src/database/database.module';

@Module({
  imports: [databaseModule],
  providers: [UserSurveysResolver, UserSurveysService],
  exports: [UserSurveysService],
})
export class UserSurveysModule {}
