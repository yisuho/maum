import { Question } from 'src/questions/entities/question.entity';

export interface CreateChoiceInfo {
  parentsQuestion: Question;
  choiceNumber: number;
  content: string;
  point: number;
}
