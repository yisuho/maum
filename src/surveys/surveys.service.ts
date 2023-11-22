import { Inject, Injectable } from '@nestjs/common';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';
import { DeleteResult, Repository } from 'typeorm';
import { Survey } from './entities/survey.entity';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class SurveysService {
  constructor(
    @Inject('SURVEY_REPOSITORY')
    private surveyRepository: Repository<Survey>,
  ) {}
  async create(createSurveyInput: CreateSurveyInput): Promise<Survey> {
    const createSurvey = this.surveyRepository.create(createSurveyInput);
    const saveSurvey = await this.surveyRepository.save(createSurvey);
    return saveSurvey;
  }

  async findAll(): Promise<Survey[]> {
    const findAll = this.surveyRepository.find();
    return findAll;
  }

  async findOne(id: number): Promise<Survey> {
    const findOne = await this.surveyRepository.findOne({ where: { id } });
    if (!findOne) {
      throw new ApolloError('해당 설문지가 없습니다');
    }
    return findOne;
  }

  async update(
    id: number,
    updateSurveyInput: UpdateSurveyInput,
  ): Promise<Survey> {
    await this.surveyRepository.update(id, updateSurveyInput);

    const updateSurveyResult = await this.findOne(id);
    return updateSurveyResult;
  }

  async remove(id: number): Promise<boolean> {
    const survey = await this.findOne(id);
    await this.surveyRepository.remove(survey);

    return true;
  }
}
