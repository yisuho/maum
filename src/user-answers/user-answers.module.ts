import { Module } from '@nestjs/common';
import { UserAnswersService } from './user-answers.service';
import { UserAnswersResolver } from './user-answers.resolver';
import { databaseModule } from 'src/database/database.module';
import { SurveysModule } from 'src/surveys/surveys.module';
import { UserSurveysModule } from 'src/user-surveys/user-surveys.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { ChoicesModule } from 'src/choices/choices.module';

@Module({
  imports: [
    databaseModule,
    SurveysModule,
    UserSurveysModule,
    SurveysModule,
    QuestionsModule,
    ChoicesModule,
  ],
  providers: [UserAnswersResolver, UserAnswersService],
})
export class UserAnswersModule {}
