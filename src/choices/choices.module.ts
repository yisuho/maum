import { Module } from '@nestjs/common';
import { ChoicesService } from './choices.service';
import { ChoicesResolver } from './choices.resolver';
import { databaseModule } from 'src/database/database.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { ChoiceRepository } from './choices.repository';

@Module({
  imports: [databaseModule, QuestionsModule],
  providers: [ChoicesResolver, ChoicesService, ...ChoiceRepository],
})
export class ChoicesModule {}
