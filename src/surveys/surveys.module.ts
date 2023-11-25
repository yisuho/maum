import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysResolver } from './surveys.resolver';
import { databaseModule } from 'src/database/database.module';

@Module({
  imports: [databaseModule],
  providers: [SurveysResolver, SurveysService],
  exports: [SurveysService],
})
export class SurveysModule {}
