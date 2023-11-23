import { DataSource } from 'typeorm';
import { Choice } from './entities/choice.entity';

export const ChoiceRepository = [
  {
    provide: 'CHOICE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Choice),
    inject: ['DATA_SOURCE'],
  },
];
