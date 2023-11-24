import { CreateUserAnswerInput } from './create-user-answer.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserAnswerInput extends PartialType(CreateUserAnswerInput) {
  @Field(() => Int)
  id: number;
}
