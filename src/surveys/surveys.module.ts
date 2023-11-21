import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysResolver } from './surveys.resolver';
import { databaseModule } from 'src/database/database.module';
import { SurveyRepository } from './surveys.repository';

@Module({
  imports: [databaseModule],
  providers: [SurveysResolver, SurveysService, ...SurveyRepository],
})
export class SurveysModule {}
