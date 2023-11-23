import { SurveysService } from './../surveys/surveys.service';
import { Inject, Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Brackets, Repository } from 'typeorm';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject('QUESTION_REPOSITORY')
    private questionRepository: Repository<Question>,
    private surveysService: SurveysService,
  ) {}
  async create(createQuestionInput: CreateQuestionInput): Promise<Question> {
    const { content, questionNumber, parentsSurveyId } = createQuestionInput;
    console.log('asdfasfs', createQuestionInput.questionNumber);

    const findParentsSurvey = await this.surveysService.findOne(
      parentsSurveyId,
    );
    await this.checkQuestion(createQuestionInput);

    const createQuestion = this.questionRepository.create({
      content,
      questionNumber,
      parentsSurvey: findParentsSurvey,
      parentsSurveyId,
    });
    const saveQuestion = await this.questionRepository.save(createQuestion);
    return saveQuestion;
  }

  async findOne(id: number): Promise<Question> {
    const findOne = await this.questionRepository.findOne({ where: { id } });
    if (!findOne) {
      throw new Error('해당 문제가 없습니다.');
    }
    return findOne;
  }

  async update(
    id: number,
    updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    const findQuestion = await this.findOne(id);

    const checkInfo: CreateQuestionInput = {
      parentsSurveyId: findQuestion.parentsSurveyId,
      questionNumber: updateQuestionInput.questionNumber,
      content: updateQuestionInput.content,
    };
    await this.checkQuestion(checkInfo, id);

    await this.questionRepository.update(id, updateQuestionInput);
    const updateQuestionResult = await this.findOne(id);
    return updateQuestionResult;
  }

  async remove(id: number): Promise<boolean> {
    const question = await this.findOne(id);
    const removeResult = await this.questionRepository.remove(question);
    if (removeResult.id) {
      return false;
    }
    return true;
  }

  private async checkQuestion(
    checkInfo: CreateQuestionInput,
    excludeId?: number,
  ): Promise<Question> {
    const { parentsSurveyId, questionNumber, content } = checkInfo;

    const queryBuilder = this.questionRepository
      .createQueryBuilder('question')
      .where('question.parentsSurveyId=:parentsSurveyId', { parentsSurveyId })
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
      queryBuilder.andWhere('choice.id !=:excludeId', { excludeId });
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

  //설문지에 포함된 문제들 전체보기
}
