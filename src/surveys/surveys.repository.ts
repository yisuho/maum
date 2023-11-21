import { DataSource } from 'typeorm';
import { Survey } from './entities/survey.entity';

export const SurveyRepository = [
  {
    provide: 'SURVEY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Survey),
    inject: ['DATA_SOURCE'],
  },
];
