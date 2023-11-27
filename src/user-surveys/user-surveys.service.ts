import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserSurvey } from './entities/user-survey.entity';
import { Survey } from 'src/surveys/entities/survey.entity';
import {
  CompletAnswer,
  CompleteUserSurvey,
  UserAnswer,
} from 'src/user-answers/entities/user-answer.entity';
import { CompleteUserSurveyInfo } from './model/user-surveys.model';

@Injectable()
export class UserSurveysService {
  async create(
    originalSurvey: Survey,
    manager: EntityManager,
  ): Promise<UserSurvey> {
    const createUserSurvey = manager.create(UserSurvey, {
      originalSurvey,
    });
    const saveUserSurvey = await manager.save(UserSurvey, createUserSurvey);

    return saveUserSurvey;
  }

  async findAll(manager: EntityManager): Promise<UserSurvey[]> {
    const findAll = await manager
      .createQueryBuilder(UserSurvey, 'userSurvey')
      .leftJoinAndSelect('userSurvey.originalSurvey', 'survey')
      .getMany();
    return findAll;
  }

  async findOne(
    id: number,
    manager: EntityManager,
  ): Promise<CompleteUserSurvey> {
    const userSurvey = await manager.findOne(UserSurvey, {
      where: { id },
      relations: [
        'originalSurvey',
        'userAnswer',
        'originalSurvey.question',
        'originalSurvey.question.choice',
      ],
    });

    if (!userSurvey) {
      throw new Error('저장된 사용자 응답 설문지가 없습니다.');
    }

    const completeUserSurveyInfo: CompleteUserSurveyInfo = {
      createUserAnswer: userSurvey.userAnswer,
      originalSurvey: userSurvey.originalSurvey,
      userSurvey,
    };

    const completeUserSurvey = await this.completeUserSurvey(
      completeUserSurveyInfo,
    );

    return completeUserSurvey;
  }

  private userAnswerTotalScore(createUserAnswer: UserAnswer[]): number {
    const totalScore = createUserAnswer.reduce(
      (total, answer) => total + answer.point,
      0,
    );

    return totalScore;
  }

  async completeUserSurvey(
    completeUserSurveyInfo: CompleteUserSurveyInfo,
  ): Promise<CompleteUserSurvey> {
    const { createUserAnswer, originalSurvey, userSurvey } =
      completeUserSurveyInfo;

    const surveyQuestion = originalSurvey.question;

    const totalScore = this.userAnswerTotalScore(createUserAnswer);

    const completAnswers: CompletAnswer[] = surveyQuestion.flatMap(
      (question) => {
        return createUserAnswer
          .filter((answer) => question.id === answer.questionId)
          .map((answer) => {
            return {
              id: question.id,
              questionNumber: question.questionNumber,
              content: question.content,
              selectChoiceId: answer.selectChoiceId,
              point: answer.point,
              choice: question.choice,
            };
          });
      },
    );
    const completeUserSurvey: CompleteUserSurvey = {
      id: userSurvey.id,
      originalSurveyId: originalSurvey.id,
      title: originalSurvey.title,
      description: originalSurvey.description,
      footer: originalSurvey.footer,
      totalScore,
      question: completAnswers,
    };
    return completeUserSurvey;
  }
}
