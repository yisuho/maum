import { UserSurveysService } from './../user-surveys/user-surveys.service';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserAnswersService } from './user-answers.service';
import { CompleteUserSurvey, UserAnswer } from './entities/user-answer.entity';
import { CreateUserAnswerInput } from './dto/create-user-answer.input';
import { UpdateUserAnswerInput } from './dto/update-user-answer.input';
import { SurveysService } from 'src/surveys/surveys.service';
import { UserSurvey } from 'src/user-surveys/entities/user-survey.entity';
import { CreateAnswerInfo } from './model/user-answer.model';

@Resolver(() => UserAnswer)
export class UserAnswersResolver {
  constructor(
    private readonly userAnswersService: UserAnswersService,
    private readonly userSurveysService: UserSurveysService,
    private readonly surveysService: SurveysService,
  ) {}

  @Mutation(() => CompleteUserSurvey)
  async createUserAnswer(
    @Args('createUserAnswerInput') createUserAnswerInput: CreateUserAnswerInput,
  ): Promise<CompleteUserSurvey> {
    const originalSurvey = await this.surveysService.findOne(
      createUserAnswerInput.OriginalSurveyId,
    );

    const userSurvey = await this.userSurveysService.create(originalSurvey);

    const createAnswerInfo: CreateAnswerInfo = {
      parentsUserSurvey: userSurvey,
      userAnswer: createUserAnswerInput.userAnswer,
    };
    const crateUserAnswer = await this.userAnswersService.create(
      createAnswerInfo,
    );
    const completeUserSurvey = await this.userAnswersService.completeUserSurvey(
      crateUserAnswer,
      originalSurvey,
    );

    return completeUserSurvey;
  }

  @Query(() => [UserAnswer], { name: 'userAnswers' })
  async findAll(): Promise<UserAnswer[]> {
    return await this.userAnswersService.findAll();
  }

  @Query(() => UserAnswer, { name: 'userAnswer' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserAnswer> {
    return await this.userAnswersService.findOne(id);
  }

  @Mutation(() => UserAnswer)
  updateUserAnswer(
    @Args('updateUserAnswerInput') updateUserAnswerInput: UpdateUserAnswerInput,
  ) {
    return this.userAnswersService.update(
      updateUserAnswerInput.id,
      updateUserAnswerInput,
    );
  }

  @Mutation(() => UserAnswer)
  removeUserAnswer(@Args('id', { type: () => Int }) id: number) {
    return this.userAnswersService.remove(id);
  }
}
