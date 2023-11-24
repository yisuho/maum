import { DataSource } from 'typeorm';
import { UserSurvey } from './entities/user-survey.entity';

export const UserSurveyRepository = [
  {
    provide: 'USER_SURVEY_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserSurvey),
    inject: ['DATA_SOURCE'],
  },
];
