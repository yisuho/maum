import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsResolver } from './questions.resolver';
import { databaseModule } from 'src/database/database.module';
import { QuestionRepository } from './question.repository';
import { SurveysModule } from 'src/surveys/surveys.module';

@Module({
  imports: [databaseModule, SurveysModule],
  providers: [QuestionsResolver, QuestionsService, ...QuestionRepository],
})
export class QuestionsModule {}
