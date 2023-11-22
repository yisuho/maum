import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateQuestionInput {
  @Field(() => Int, { nullable: false, description: 'Parents Survey ID' })
  parentsSurveyId: number;

  @Field(() => Int, { nullable: false, description: 'Question No.' })
  questionNumber: number;

  @Field(() => String, { nullable: false, description: 'Question Content' })
  content: string;
}
