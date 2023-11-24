import { CreateUserSurveyInput } from './create-user-survey.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserSurveyInput extends PartialType(CreateUserSurveyInput) {
  @Field(() => Int)
  id: number;
}
