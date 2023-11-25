import { Module } from '@nestjs/common';
import { UserAnswersService } from './user-answers.service';
import { UserAnswersResolver } from './user-answers.resolver';
import { databaseModule } from 'src/database/database.module';
import { SurveysModule } from 'src/surveys/surveys.module';
import { UserSurveysModule } from 'src/user-surveys/user-surveys.module';
import { QuestionsModule } from 'src/questions/questions.module';

@Module({
  imports: [
    databaseModule,
    SurveysModule,
    UserSurveysModule,
    SurveysModule,
    QuestionsModule,
  ],
  providers: [UserAnswersResolver, UserAnswersService],
})
export class UserAnswersModule {}
