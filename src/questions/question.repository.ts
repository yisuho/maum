import { DataSource } from 'typeorm';
import { Question } from './entities/question.entity';

export const QuestionRepository = [
  {
    provide: 'QUESTION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Question),
    inject: ['DATA_SOURCE'],
  },
];
