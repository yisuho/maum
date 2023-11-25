import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { DataSource } from 'typeorm';
import { Inject } from '@nestjs/common';

@Resolver(() => Question)
export class QuestionsResolver {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
    private readonly questionsService: QuestionsService,
  ) {}

  @Mutation(() => Question)
  async createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ): Promise<Question> {
    return await this.dataSource.transaction(async (manager) => {
      const createQuestion = await this.questionsService.create(
        createQuestionInput,
        manager,
      );
      return createQuestion;
    });
  }

  @Query(() => Question, { name: 'question' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Question> {
    return await this.dataSource.transaction(async (manager) => {
      const findOne = await this.questionsService.findOne(id, manager);
      return findOne;
    });
  }

  @Mutation(() => Question)
  async updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    return await this.dataSource.transaction(async (manager) => {
      const updateQuestion = await this.questionsService.update(
        updateQuestionInput.id,
        updateQuestionInput,
        manager,
      );
      return updateQuestion;
    });
  }

  @Mutation(() => Boolean)
  async removeQuestion(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      return this.questionsService.remove(id, manager);
    });
  }
}
