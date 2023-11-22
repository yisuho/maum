import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateSurveyInput {
  @Field({ nullable: false, description: 'Survey Title' })
  title: string;

  @Field({ nullable: true, description: 'Survey Description' })
  description: string;

  @Field({ nullable: true, description: 'Survey Footer' })
  footer: string;
}
