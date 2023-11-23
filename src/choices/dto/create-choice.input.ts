import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateChoiceInput {
  @Field(() => Int, { nullable: false, description: 'Parents Question ID' })
  parentsQuestionId: number;

  @Field(() => Int, { nullable: false, description: 'Choice No.' })
  choiceNumber: number;

  @Field(() => String, { nullable: false, description: 'Choice Content' })
  content: string;

  @Field(() => Int, { nullable: false, description: 'Choice Point' })
  point: number;
}
