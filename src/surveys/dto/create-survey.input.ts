import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSurveyInput {
  @Field({ nullable: false })
  title: string;

  @Field({ nullable: false })
  description: string;

  @Field({ nullable: false })
  footer: string;
}
