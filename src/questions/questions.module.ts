import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsResolver } from './questions.resolver';
import { databaseModule } from 'src/database/database.module';
import { SurveysModule } from 'src/surveys/surveys.module';

@Module({
  imports: [databaseModule, SurveysModule],
  providers: [QuestionsResolver, QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
