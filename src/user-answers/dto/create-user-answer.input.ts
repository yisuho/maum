import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserAnswerInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  OriginalSurveyId: number;

  @Field(() => [Answer])
  userAnswer: Answer[];
}

@InputType()
export class Answer {
  @Field(() => Int, { nullable: false, description: 'Question No.' })
  questionId: number;

  @Field(() => Int, { nullable: false, description: 'Choice No.' })
  selectChoiceId: number;
}
