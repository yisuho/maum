import { SurveysService } from './../surveys/surveys.service';
import { Inject, Injectable } from '@nestjs/common';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { Survey } from 'src/surveys/entities/survey.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject('QUESTION_REPOSITORY')
    private questionRepository: Repository<Question>,
    private surveysService: SurveysService,
  ) {}
  async create(createQuestionInput: CreateQuestionInput): Promise<Question> {
    const { content, questionNumber, parentsSurveyId } = createQuestionInput;
    const findOneSurvey = await this.surveysService.findOne(parentsSurveyId);
    await this.checkQuestionNumber(parentsSurveyId, questionNumber);

    const createQuestion = this.questionRepository.create({
      content,
      questionNumber,
      parentsSurvey: findOneSurvey,
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

    await this.checkQuestionNumber(
      findQuestion.parentsSurveyId,
      updateQuestionInput.questionNumber,
    );

    await this.questionRepository.update(id, updateQuestionInput);
    const updateQuestionResult = await this.findOne(id);
    return updateQuestionResult;
  }

  async remove(id: number): Promise<boolean> {
    const question = await this.findOne(id);
    await this.questionRepository.remove(question);
    return true;
  }

  async checkQuestionNumber(
    parentsSurveyId: number,
    questionNumber: number,
  ): Promise<Question> {
    const checkQuestionNumber = await this.questionRepository.findOne({
      where: { parentsSurveyId, questionNumber },
    });

    if (checkQuestionNumber) {
      throw new Error(
        '설문지에 같은 번호의 문제가 이미 존재합니다. 번호를 변경하세요',
      );
    }
    return checkQuestionNumber;
  }
}
