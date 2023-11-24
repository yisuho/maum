import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserSurveyInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
