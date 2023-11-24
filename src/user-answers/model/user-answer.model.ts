import { Choice } from 'src/choices/entities/choice.entity';
import { Answer } from '../dto/create-user-answer.input';
import { UserSurvey } from 'src/user-surveys/entities/user-survey.entity';

export interface CreateAnswerInfo {
  parentsUserSurvey: UserSurvey;
  userAnswer: Answer[];
}
