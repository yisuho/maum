import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateQuestionInput {
  @Field(() => Int, { nullable: false, description: 'Question ID' })
  id: number;

  @Field(() => Int, { nullable: true, description: 'Question No.' })
  questionNumber: number;

  @Field(() => String, { nullable: true, description: 'Question Content' })
  content: string;
}
