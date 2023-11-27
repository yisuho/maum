import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateUserAnswerInput {
  @Field(() => Int, { nullable: false, description: 'User Answer ID' })
  id: number;

  @Field(() => Int, { nullable: true, description: 'User Select Choice ID' })
  selectChoiceId: number;
}
