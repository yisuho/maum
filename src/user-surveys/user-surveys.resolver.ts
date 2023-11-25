import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UserSurveysService } from './user-surveys.service';
import { UserSurvey } from './entities/user-survey.entity';
import { CompleteUserSurvey } from 'src/user-answers/entities/user-answer.entity';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Resolver(() => UserSurvey)
export class UserSurveysResolver {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
    private readonly userSurveysService: UserSurveysService,
  ) {}

  @Query(() => CompleteUserSurvey, { name: 'userSurvey' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<CompleteUserSurvey> {
    return await this.dataSource.transaction(async (manager) => {
      const findOneUserSurvey = await this.userSurveysService.findOne(
        id,
        manager,
      );

      return findOneUserSurvey;
    });
  }
}
