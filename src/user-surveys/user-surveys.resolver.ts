import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserSurveysService } from './user-surveys.service';
import { UserSurvey } from './entities/user-survey.entity';
import { CreateUserSurveyInput } from './dto/create-user-survey.input';
import { UpdateUserSurveyInput } from './dto/update-user-survey.input';

@Resolver(() => UserSurvey)
export class UserSurveysResolver {
  constructor(private readonly userSurveysService: UserSurveysService) {}

  // @Mutation(() => UserSurvey)
  // createUserSurvey(@Args('createUserSurveyInput') createUserSurveyInput: CreateUserSurveyInput) {
  //   return this.userSurveysService.create(createUserSurveyInput);
  // }

  // @Query(() => [UserSurvey], { name: 'userSurveys' })
  // findAll() {
  //   return this.userSurveysService.findAll();
  // }

  // @Query(() => UserSurvey, { name: 'userSurvey' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.userSurveysService.findOne(id);
  // }

  // @Mutation(() => UserSurvey)
  // updateUserSurvey(@Args('updateUserSurveyInput') updateUserSurveyInput: UpdateUserSurveyInput) {
  //   return this.userSurveysService.update(updateUserSurveyInput.id, updateUserSurveyInput);
  // }

  // @Mutation(() => UserSurvey)
  // removeUserSurvey(@Args('id', { type: () => Int }) id: number) {
  //   return this.userSurveysService.remove(id);
  // }
}
