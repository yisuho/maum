import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SurveysService } from './surveys.service';
import { Survey } from './entities/survey.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';
import { DataSource } from 'typeorm';
import { Inject } from '@nestjs/common';

@Resolver(() => Survey)
export class SurveysResolver {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
    private readonly surveysService: SurveysService,
  ) {}

  @Mutation(() => Survey)
  async createSurvey(
    @Args('createSurveyInput') createSurveyInput: CreateSurveyInput,
  ): Promise<Survey> {
    return await this.dataSource.transaction(async (manager) => {
      const createSurvey = await this.surveysService.create(
        createSurveyInput,
        manager,
      );
      return createSurvey;
    });
  }

  @Query(() => [Survey], { name: 'surveys' })
  async findAll(): Promise<Survey[]> {
    return await this.dataSource.transaction(async (manager) => {
      const findAll = await this.surveysService.findAll(manager);
      return findAll;
    });
  }

  @Query(() => Survey, { name: 'survey' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Survey> {
    return await this.dataSource.transaction(async (manager) => {
      const findOne = await this.surveysService.findOne(id, manager);

      return findOne;
    });
  }

  @Mutation(() => Survey)
  async updateSurvey(
    @Args('updateSurveyInput') updateSurveyInput: UpdateSurveyInput,
  ): Promise<Survey> {
    return await this.dataSource.transaction(async (manager) => {
      const updateSurvey = this.surveysService.update(
        updateSurveyInput.id,
        updateSurveyInput,
        manager,
      );
      return updateSurvey;
    });
  }

  @Mutation(() => Boolean)
  async removeSurvey(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const removeSurvey = await this.surveysService.remove(id, manager);

      return removeSurvey;
    });
  }
}
