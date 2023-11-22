import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SurveysService } from './surveys.service';
import { Survey } from './entities/survey.entity';
import { CreateSurveyInput } from './dto/create-survey.input';
import { UpdateSurveyInput } from './dto/update-survey.input';
import { ApolloError } from 'apollo-server-express';
import { DeleteResult } from 'typeorm';

@Resolver(() => Survey)
export class SurveysResolver {
  constructor(private readonly surveysService: SurveysService) {}

  @Mutation(() => Survey)
  async createSurvey(
    @Args('createSurveyInput') createSurveyInput: CreateSurveyInput,
  ): Promise<Survey> {
    const createSurvey = await this.surveysService.create(createSurveyInput);
    return createSurvey;
  }

  @Query(() => [Survey], { name: 'surveys' })
  async findAll(): Promise<Survey[]> {
    const findAll = this.surveysService.findAll();
    return findAll;
  }

  @Query(() => Survey, { name: 'survey' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Survey> {
    const findOne = await this.surveysService.findOne(id);

    return findOne;
  }

  @Mutation(() => Survey)
  async updateSurvey(
    @Args('updateSurveyInput') updateSurveyInput: UpdateSurveyInput,
  ): Promise<Survey> {
    const updateSurvey = this.surveysService.update(
      updateSurveyInput.id,
      updateSurveyInput,
    );
    return updateSurvey;
  }

  @Mutation(() => Boolean)
  async removeSurvey(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const removeSurvey = await this.surveysService.remove(id);

    return removeSurvey;
  }
}
