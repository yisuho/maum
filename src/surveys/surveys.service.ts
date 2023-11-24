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
    const createSurvey = this.surveyRepository.create(createSurveyInput);
    const saveSurvey = await this.surveyRepository.save(createSurvey);
    return saveSurvey;
  }

  async findAll(): Promise<Survey[]> {
    const findAll = this.surveyRepository.find();
    return findAll;
  }

  async findOne(id: number): Promise<Survey> {
    const findOne = await this.surveyRepository
      .createQueryBuilder('survey')
      .innerJoinAndSelect('survey.question', 'question')
      .leftJoinAndSelect('question.choice', 'choice')
      .where('survey.id = :id', { id })
      .orderBy({
        'question.questionNumber': 'ASC',
        'choice.choiceNumber': 'ASC',
      })
      .getOne();

    if (!findOne) {
      throw new Error('해당 설문지가 없습니다');
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
    const removeSurvey = await this.surveyRepository.remove(survey);
    if (removeSurvey.id) {
      return false;
    }

    return true;
  }
}
