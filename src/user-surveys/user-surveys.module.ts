import { Module } from '@nestjs/common';
import { UserSurveysService } from './user-surveys.service';
import { UserSurveysResolver } from './user-surveys.resolver';
import { databaseModule } from 'src/database/database.module';
import { UserSurveyRepository } from './user-survrys.repository';

@Module({
  imports: [databaseModule],
  providers: [UserSurveysResolver, UserSurveysService, ...UserSurveyRepository],
  exports: [UserSurveysService],
})
export class UserSurveysModule {}
