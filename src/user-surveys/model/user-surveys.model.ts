import { Survey } from 'src/surveys/entities/survey.entity';
import { UserAnswer } from 'src/user-answers/entities/user-answer.entity';
import { UserSurvey } from '../entities/user-survey.entity';

export interface CompleteUserSurveyInfo {
  createUserAnswer: UserAnswer[];
  originalSurvey: Survey;
  userSurvey: UserSurvey;
}
