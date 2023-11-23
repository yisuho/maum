import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChoicesService } from './choices.service';
import { Choice } from './entities/choice.entity';
import { CreateChoiceInput } from './dto/create-choice.input';
import { UpdateChoiceInput } from './dto/update-choice.input';

@Resolver(() => Choice)
export class ChoicesResolver {
  constructor(private readonly choicesService: ChoicesService) {}

  @Mutation(() => Choice)
  async createChoice(
    @Args('createChoiceInput') createChoiceInput: CreateChoiceInput,
  ): Promise<Choice> {
    const createChoice = await this.choicesService.create(createChoiceInput);
    return createChoice;
  }

  // @Query(() => [Choice], { name: 'choices' })
  // findAll() {
  //   return this.choicesService.findAll();
  // }

  @Query(() => Choice, { name: 'choice' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Choice> {
    const findOne = await this.choicesService.findOne(id);
    return findOne;
  }

  @Mutation(() => Choice)
  async updateChoice(
    @Args('updateChoiceInput') updateChoiceInput: UpdateChoiceInput,
  ): Promise<Choice> {
    const updateChoice = await this.choicesService.update(
      updateChoiceInput.id,
      updateChoiceInput,
    );
    return updateChoice;
  }

  @Mutation(() => Boolean)
  async removeChoice(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const removeResult = await this.choicesService.remove(id);
    return removeResult;
  }
}
