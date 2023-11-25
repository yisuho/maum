import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChoicesService } from './choices.service';
import { Choice } from './entities/choice.entity';
import { CreateChoiceInput } from './dto/create-choice.input';
import { UpdateChoiceInput } from './dto/update-choice.input';
import { Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Resolver(() => Choice)
export class ChoicesResolver {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
    private choicesService: ChoicesService,
  ) {}

  @Mutation(() => Choice)
  async createChoice(
    @Args('createChoiceInput') createChoiceInput: CreateChoiceInput,
  ): Promise<Choice> {
    return await this.dataSource.transaction(async (manager) => {
      const createChoice = await this.choicesService.create(
        createChoiceInput,
        manager,
      );
      return createChoice;
    });
  }

  @Query(() => Choice, { name: 'choice' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Choice> {
    return await this.dataSource.transaction(async (manager) => {
      const findOne = await this.choicesService.findOne(id, manager);
      return findOne;
    });
  }

  @Mutation(() => Choice)
  async updateChoice(
    @Args('updateChoiceInput') updateChoiceInput: UpdateChoiceInput,
  ): Promise<Choice> {
    return await this.dataSource.transaction(async (manager) => {
      const updateChoice = await this.choicesService.update(
        updateChoiceInput.id,
        updateChoiceInput,
        manager,
      );
      return updateChoice;
    });
  }

  @Mutation(() => Boolean)
  async removeChoice(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return await this.dataSource.transaction(async (manager) => {
      const removeResult = await this.choicesService.remove(id, manager);
      return removeResult;
    });
  }
}
