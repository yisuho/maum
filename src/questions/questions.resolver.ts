import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';

@Resolver(() => Question)
export class QuestionsResolver {
  constructor(private readonly questionsService: QuestionsService) {}

  @Mutation(() => Question)
  async createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ): Promise<Question> {
    const createQuestion = await this.questionsService.create(
      createQuestionInput,
    );
    return createQuestion;
  }

  @Query(() => Question, { name: 'question' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Question> {
    const findOne = await this.questionsService.findOne(id);
    return findOne;
  }

  @Mutation(() => Question)
  async updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    const updateQuestion = await this.questionsService.update(
      updateQuestionInput.id,
      updateQuestionInput,
    );
    return updateQuestion;
  }

  @Mutation(() => Boolean)
  async removeQuestion(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.questionsService.remove(id);
  }
}
