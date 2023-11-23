import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Question } from 'src/questions/entities/question.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Survey {
  @Field(() => Int, { description: 'Survey ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: false, description: 'Survey Title' })
  @Column()
  title: string;

  @Field(() => String, { nullable: false, description: 'Survey Description' })
  @Column()
  description: string;

  @Field(() => String, { nullable: false, description: 'Survey Footer' })
  @Column()
  footer: string;

  @Field(() => [Question])
  @OneToMany(() => Question, (question) => question.parentsSurvey, {
    lazy: true,
  })
  question: Question[];
}
