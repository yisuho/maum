import { DataSource } from 'typeorm';
import { UserAnswer } from './entities/user-answer.entity';

export const UserAnswerRepository = [
  {
    provide: 'USER_ANSWER_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserAnswer),
    inject: ['DATA_SOURCE'],
  },
];
