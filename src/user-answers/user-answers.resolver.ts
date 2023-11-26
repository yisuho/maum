import { UserSurveysService } from './../user-surveys/user-surveys.service';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserAnswersService } from './user-answers.service';
import { CompleteUserSurvey, UserAnswer } from './entities/user-answer.entity';
import { CreateUserAnswerInput } from './dto/create-user-answer.input';
import { UpdateUserAnswerInput } from './dto/update-user-answer.input';
import { SurveysService } from 'src/surveys/surveys.service';
import { UserSurvey } from 'src/user-surveys/entities/user-survey.entity';
import { CreateAnswerInfo } from './model/user-answer.model';
import { CompleteUserSurveyInfo } from 'src/user-surveys/model/user-surveys.model';
import { DataSource } from 'typeorm';
import { Inject } from '@nestjs/common';

@Resolver(() => UserAnswer)
export class UserAnswersResolver {
  constructor(
    private readonly userAnswersService: UserAnswersService,
    private readonly userSurveysService: UserSurveysService,
    private readonly surveysService: SurveysService,
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {}

  @Mutation(() => CompleteUserSurvey)
  async createUserAnswer(
    @Args('createUserAnswerInput') createUserAnswerInput: CreateUserAnswerInput,
  ): Promise<CompleteUserSurvey> {
    return await this.dataSource.transaction(async (manager) => {
      const originalSurvey = await this.surveysService.findOne(
        createUserAnswerInput.OriginalSurveyId,
        manager,
      );

      const userAnswerValidation = this.userAnswersService.userAnswerValidation(
        originalSurvey,
        createUserAnswerInput.userAnswer,
      );

      const userSurvey = await this.userSurveysService.create(
        originalSurvey,
        manager,
      );

      const createAnswerInfo: CreateAnswerInfo = {
        parentsUserSurvey: userSurvey,
        userAnswer: createUserAnswerInput.userAnswer,
      };
      const createUserAnswer = await this.userAnswersService.create(
        createAnswerInfo,
        manager,
      );

      const completeUserSurveyInfo: CompleteUserSurveyInfo = {
        createUserAnswer,
        originalSurvey,
        userSurvey,
      };

      const completeUserSurvey =
        await this.userSurveysService.completeUserSurvey(
          completeUserSurveyInfo,
        );

      return completeUserSurvey;
    });
  }

  @Query(() => UserAnswer, { name: 'userAnswer' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserAnswer> {
    return await this.dataSource.transaction(async (manager) => {
      const findOneUserAnswer = await this.userAnswersService.findOne(
        id,
        manager,
      );

      return findOneUserAnswer;
    });
  }

  @Mutation(() => UserAnswer)
  async updateUserAnswer(
    @Args('updateUserAnswerInput') updateUserAnswerInput: UpdateUserAnswerInput,
  ) {
    return this.dataSource.transaction(async (manager) => {
      return this.userAnswersService.update(
        updateUserAnswerInput.id,
        updateUserAnswerInput,
        manager,
      );
    });
  }

  @Mutation(() => Boolean)
  async removeUserAnswer(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const removeUserAnswer = await this.userAnswersService.remove(
        id,
        manager,
      );
      return removeUserAnswer;
    });
  }
}
