import { Inject, Injectable } from '@nestjs/common';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';
import { Repository } from 'typeorm';
import { Survey } from './entities/survey.entity';

@Injectable()
export class SurveysService {
  constructor(
    @Inject('SURVEY_REPOSITORY')
    private surveyRepository: Repository<Survey>,
  ) {}
  async create(createSurveyInput: CreateSurveyInput): Promise<Survey> {
    const { title, content, footer } = createSurveyInput;
    const createSurvey = this.surveyRepository.create(createSurveyInput);
    const saveSurvey = await this.surveyRepository.save(createSurvey);

    return saveSurvey;
  }

  findAll() {
    return `This action returns all surveys`;
  }

  findOne(id: number) {
    return `This action returns a #${id} survey`;
  }

  update(id: number, updateSurveyInput: UpdateSurveyInput) {
    return `This action updates a #${id} survey`;
  }

  remove(id: number) {
    return `This action removes a #${id} survey`;
  }
}
