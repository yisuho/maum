import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateChoiceInput {
  @Field(() => Int, { nullable: false, description: 'Choice ID' })
  id: number;

  @Field(() => Int, { nullable: true, description: 'Choice No.' })
  choiceNumber: number;

  @Field(() => String, { nullable: true, description: 'Choice Content' })
  content: string;

  @Field(() => Int, { nullable: true, description: 'Choice Point' })
  point: number;
}
