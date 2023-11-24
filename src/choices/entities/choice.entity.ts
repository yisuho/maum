import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Question } from 'src/questions/entities/question.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Choice {
  @Field(() => Int, { description: 'Choice ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Question, {
    nullable: false,
    description: 'Parents Question ',
  })
  @ManyToOne(() => Question, (question) => question.choice, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parents_question' })
  parentsQuestion: Question;

  @Field(() => Int, { nullable: false })
  @Column({ name: 'choice_no' })
  choiceNumber: number;

  @Field(() => String, { nullable: false })
  @Column()
  content: string;

  @Field(() => Int, { nullable: false })
  @Column()
  point: number;
}
