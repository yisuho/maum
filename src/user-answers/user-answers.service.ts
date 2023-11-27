import { ChoicesService } from './../choices/choices.service';
import { UserSurveysService } from './../user-surveys/user-surveys.service';
import { QuestionsService } from './../questions/questions.service';
import { Injectable } from '@nestjs/common';
import { UpdateUserAnswerInput } from './dto/update-user-answer.input';
import { EntityManager } from 'typeorm';
import { UserAnswer } from './entities/user-answer.entity';
import { CreateAnswerInfo } from './model/user-answer.model';
import { Survey } from 'src/surveys/entities/survey.entity';
import { Answer } from './dto/create-user-answer.input';
import { UserSurvey } from 'src/user-surveys/entities/user-survey.entity';

@Injectable()
export class UserAnswersService {
  constructor(
    private questionsService: QuestionsService,
    private userSurveysService: UserSurveysService,
    private choicesService: ChoicesService,
  ) {}

  async create(
    createAnswerInfo: CreateAnswerInfo,
    manager: EntityManager,
  ): Promise<UserAnswer[]> {
    const { parentsUserSurvey, userAnswer } = createAnswerInfo;

    const createUserAnswer = userAnswer.map(async (answer) => {
      return await this.saveUserAnswer(answer, parentsUserSurvey, manager);
    });
    const savedAnswers = await Promise.all(createUserAnswer);

    return savedAnswers;
  }

  async saveUserAnswer(
    answer: Answer,
    parentsUserSurvey: UserSurvey,
    manager: EntityManager,
  ): Promise<UserAnswer> {
    const selectChoiceOfPoint = await this.selectChoiceOfPoint(
      answer.questionId,
      answer.selectChoiceId,
      manager,
    );

    const createAnswer = manager.create(UserAnswer, {
      parentsUserSurvey,
      questionId: answer.questionId,
      selectChoiceId: answer.selectChoiceId,
      point: selectChoiceOfPoint,
    });

    const saveAnswer = await manager.save(UserAnswer, createAnswer);

    return saveAnswer;
  }

  async findAnswersIncludUserSurvey(
    userSurveyId: number,
    manager: EntityManager,
  ): Promise<UserAnswer[]> {
    const checkUserSurvey = await this.userSurveysService.findOne(
      userSurveyId,
      manager,
    );

    const findAnswersIncludUserSurvey = await manager
      .createQueryBuilder(UserAnswer, 'userAnswer')
      .leftJoinAndSelect('userAnswer.parentsUserSurvey', 'userSurvey')
      .where('userAnswer.parentsUserSurvey=:userSurveyId', { userSurveyId })
      .getMany();

    return findAnswersIncludUserSurvey;
  }

  async findOne(id: number, manager: EntityManager): Promise<UserAnswer> {
    const findOne = await manager
      .createQueryBuilder(UserAnswer, 'userAnswer')
      .leftJoinAndSelect('userAnswer.parentsUserSurvey', 'userSurvey')
      .leftJoinAndSelect('userSurvey.originalSurvey', 'survey')
      .where('userAnswer.id=:id', { id })
      .getOne();
    if (!findOne) {
      throw new Error('저장된 사용자 답변이 없습니다.');
    }
    return findOne;
  }

  async update(
    id: number,
    updateUserAnswerInput: UpdateUserAnswerInput,
    manager: EntityManager,
  ): Promise<UserAnswer> {
    const checkUserAnswer = await this.findOne(id, manager);
    const checkChoice = await this.choicesService.findOne(
      updateUserAnswerInput.selectChoiceId,
      manager,
    );
    const findQuestion = await this.choicesService.findOne(
      updateUserAnswerInput.selectChoiceId,
      manager,
    );

    const selectChoiceOfPoint = await this.selectChoiceOfPoint(
      findQuestion.parentsQuestion.id,
      updateUserAnswerInput.selectChoiceId,
      manager,
    );

    const updateUserAnswerInfo = {
      ...updateUserAnswerInput,
      point: selectChoiceOfPoint,
    };

    await manager.update(UserAnswer, id, updateUserAnswerInfo);
    const completUserAnswerUpdate = await this.findOne(id, manager);
    return completUserAnswerUpdate;
  }

  async remove(id: number, manager: EntityManager): Promise<boolean> {
    const userAnswer = await this.findOne(id, manager);
    const removeUserAnswer = await manager.remove(UserAnswer, userAnswer);

    if (removeUserAnswer.id) {
      return false;
    }
    return true;
  }

  userAnswerValidation(originalSurvey: Survey, userAnswer: Answer[]): void {
    this.checkForDuplicateUserAnswers(userAnswer);
    this.checkQuestionAnswerCountMatch(originalSurvey, userAnswer);
    this.checkQuestionAnswerMatch(originalSurvey, userAnswer);
    return;
  }

  private checkForDuplicateUserAnswers(userAnswer: Answer[]): void {
    const checkForDuplicateUserAnswersHash = new Map();
    for (const answer of userAnswer) {
      if (checkForDuplicateUserAnswersHash.has(answer.questionId)) {
        throw new Error(`같은 질문에 중복된 답변이 존재합니다.`);
      }
      checkForDuplicateUserAnswersHash.set(answer.questionId, 1);
    }
  }

  private checkQuestionAnswerCountMatch(
    originalSurvey: Survey,
    userAnswer: Answer[],
  ): void {
    const surveyQuestion = originalSurvey.question;
    if (!userAnswer.length) {
      throw new Error(`입력된 답변이 없습니다.`);
    }

    if (surveyQuestion.length !== userAnswer.length) {
      if (surveyQuestion.length > userAnswer.length) {
        const userAnswerHash = new Set(
          userAnswer.map((answer) => {
            return answer.questionId;
          }),
        );

        const emptyAnswersQuestion = surveyQuestion.filter((question) => {
          return !userAnswerHash.has(question.id);
        });

        const emptyAnswersQuestionNumber = emptyAnswersQuestion
          .map((question) => {
            return question.questionNumber;
          })
          .join(',');

        throw new Error(
          `${emptyAnswersQuestionNumber}번 문제의 답변이 없습니다.`,
        );
      } else if (surveyQuestion.length < userAnswer.length) {
        throw new Error(
          '문제의 수를 확인해 주세요.문제보다 많은 수의 답변이 입력되었습니다.',
        );
      }
    }
  }

  private checkQuestionAnswerMatch(
    originalSurvey: Survey,
    userAnswer: Answer[],
  ): void {
    const originalSurveyQuestionHash = new Map();

    originalSurvey.question.map((question) => {
      originalSurveyQuestionHash.set(question.id, 1);
    });

    userAnswer.map((answer) => {
      if (!originalSurveyQuestionHash.has(answer.questionId)) {
        throw new Error(
          `유효하지 않은 질문 ID (${answer.questionId})가 있습니다.`,
        );
      }
    });
  }

  private async selectChoiceOfPoint(
    questionId: number,
    selectChoiceId: number,
    manager: EntityManager,
  ): Promise<number> {
    const question = await this.questionsService.findOne(questionId, manager);
    const selectChoiceOfPoint = question.choice.find((choice) => {
      return choice.id === selectChoiceId;
    });

    return selectChoiceOfPoint.point;
  }
}
