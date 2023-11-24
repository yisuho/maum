import { Module } from '@nestjs/common';
import { UserAnswersService } from './user-answers.service';
import { UserAnswersResolver } from './user-answers.resolver';
import { databaseModule } from 'src/database/database.module';
import { UserAnswerRepository } from './user-answers.repository';
import { SurveysModule } from 'src/surveys/surveys.module';
import { UserSurveysModule } from 'src/user-surveys/user-surveys.module';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports: [
    databaseModule,
    SurveysModule,
    UserSurveysModule,
    QuestionsModule,
    SurveysModule,
  ],
  providers: [UserAnswersResolver, UserAnswersService, ...UserAnswerRepository],
})
export class UserAnswersModule {}
