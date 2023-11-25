import { CreateUserAnswerInput } from './create-user-answer.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserAnswerInput {
  @Field(() => Int, { nullable: false, description: 'User Answer ID' })
  id: number;

  @Field(() => Int, { nullable: true, description: 'Question ID' })
  questionId: number;

  @Field(() => Int, { nullable: true, description: 'User Select Choice ID' })
  selectChoiceId: number;
}
