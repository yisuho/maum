import { Survey } from 'src/surveys/entities/survey.entity';

export interface CreateQuestionInfo {
  parentsSurvey: Survey;
  questionNumber: number;
  content: string;
}
