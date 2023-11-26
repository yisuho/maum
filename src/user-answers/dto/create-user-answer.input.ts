import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserAnswerInput {
  @Field(() => Int, { description: 'Original Survey ID(Base Survey ID)' })
  OriginalSurveyId: number;

  @Field(() => [Answer], { description: 'User Answers' })
  userAnswer: Answer[];
}

@InputType()
export class Answer {
  @Field(() => Int, { nullable: false, description: 'Question ID' })
  questionId: number;

  @Field(() => Int, { nullable: false, description: 'Select Choice ID' })
  selectChoiceId: number;
}
