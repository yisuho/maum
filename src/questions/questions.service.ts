import { SurveysService } from './../surveys/surveys.service';
import { Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Brackets, EntityManager } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionInfo } from './model/question.model';

@Injectable()
export class QuestionsService {
  constructor(private surveysService: SurveysService) {}
  async create(
    createQuestionInput: CreateQuestionInput,
    manager: EntityManager,
  ): Promise<Question> {
    const { parentsSurveyId } = createQuestionInput;

    const findParentsSurvey = await this.surveysService.findOne(
      parentsSurveyId,
      manager,
    );

    await this.checkQuestion(createQuestionInput, manager);

    const createQuestionInfo: CreateQuestionInfo = {
      parentsSurvey: findParentsSurvey,
      questionNumber: createQuestionInput.questionNumber,
      content: createQuestionInput.content,
    };

    const createQuestion = manager.create(Question, createQuestionInfo);
    const saveQuestion = await manager.save(Question, createQuestion);
    return saveQuestion;
  }

  async findOne(id: number, manager: EntityManager): Promise<Question> {
    const findOne = await manager
      .createQueryBuilder(Question, 'question')
      .leftJoinAndSelect('question.parentsSurvey', 'survey.id')
      .leftJoinAndSelect('question.choice', 'choice')
      .where('question.id = :id', { id })
      .orderBy('choice.choiceNumber', 'ASC')
      .getOne();

    if (!findOne) {
      throw new Error(`해당 ID:${id} 를 가진 문제가 없습니다.`);
    }
    return findOne;
  }

  async findQuestionIncludSurvey(
    parentsSurveyId: number,
    manager: EntityManager,
  ): Promise<Question[]> {
    const checkSurvey = await this.surveysService.findOne(
      parentsSurveyId,
      manager,
    );
    const findQuestionIncludSurvey = await manager
      .createQueryBuilder(Question, 'question')
      .where('question.parentsSurvey =:parentsSurveyId', { parentsSurveyId })
      .orderBy('question.questionNumber', 'ASC')
      .getMany();
    return findQuestionIncludSurvey;
  }

  async update(
    id: number,
    updateQuestionInput: UpdateQuestionInput,
    manager: EntityManager,
  ): Promise<Question> {
    const findQuestion = await this.findOne(id, manager);

    const checkInfo: CreateQuestionInput = {
      parentsSurveyId: findQuestion.parentsSurvey.id,
      questionNumber: updateQuestionInput.questionNumber,
      content: updateQuestionInput.content,
    };
    await this.checkQuestion(checkInfo, manager, id);

    await manager.update(Question, id, updateQuestionInput);
    const updateQuestionResult = await this.findOne(id, manager);
    return updateQuestionResult;
  }

  async remove(id: number, manager: EntityManager): Promise<boolean> {
    const question = await this.findOne(id, manager);
    const removeResult = await manager.remove(Question, question);
    if (removeResult.id) {
      return false;
    }
    return true;
  }

  private async checkQuestion(
    checkInfo: CreateQuestionInput,
    manager: EntityManager,
    excludeId?: number,
  ): Promise<Question> {
    const { parentsSurveyId, questionNumber, content } = checkInfo;
    const queryBuilder = manager
      .createQueryBuilder(Question, 'question')
      .where('question.parentsSurvey = :parentsSurveyId', { parentsSurveyId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('question.questionNumber=:questionNumber', {
            questionNumber,
          }).orWhere('question.content=:content', {
            content,
          });
        }),
      );
    if (excludeId) {
      queryBuilder.andWhere('question.id !=:excludeId', { excludeId });
    }
    const checkQuestion = await queryBuilder.getOne();

    if (checkQuestion) {
      if (checkQuestion.questionNumber === questionNumber) {
        throw new Error(
          '설문지에 같은 번호의 문제가 이미 존재합니다. 번호를 변경하세요',
        );
      } else if (checkQuestion.content === content) {
        throw new Error(
          '설문지에 같은 내용의 문제가 이미 존재합니다. 내용를 변경하세요',
        );
      }
    }

    return checkQuestion;
  }
}
