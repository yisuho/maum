import { Injectable } from '@nestjs/common';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';
import { EntityManager } from 'typeorm';
import { Survey } from './entities/survey.entity';

@Injectable()
export class SurveysService {
  async create(
    createSurveyInput: CreateSurveyInput,
    manager: EntityManager,
  ): Promise<Survey> {
    const createSurvey = manager.create(Survey, createSurveyInput);
    const saveSurvey = await manager.save(Survey, createSurvey);
    return saveSurvey;
  }

  async findAll(manager: EntityManager): Promise<Survey[]> {
    const findAll = await manager.find(Survey);
    return findAll;
  }

  async findOne(id: number, manager: EntityManager): Promise<Survey> {
    const findOne = await manager
      .createQueryBuilder(Survey, 'survey')
      .leftJoinAndSelect('survey.question', 'question')
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
    manager: EntityManager,
  ): Promise<Survey> {
    await manager.update(Survey, id, updateSurveyInput);

    const updateSurveyResult = await this.findOne(id, manager);
    return updateSurveyResult;
  }

  async remove(id: number, manager: EntityManager): Promise<boolean> {
    const survey = await this.findOne(id, manager);
    const removeSurvey = await manager.remove(Survey, survey);
    if (removeSurvey.id) {
      return false;
    }

    return true;
  }
}
