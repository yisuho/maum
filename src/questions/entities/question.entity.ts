import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Choice } from 'src/choices/entities/choice.entity';
import { Survey } from 'src/surveys/entities/survey.entity';
import { UserAnswer } from 'src/user-answers/entities/user-answer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Question {
  @Field(() => Int, { description: 'Question ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Survey, {
    nullable: false,
    description: 'Parents Survey ',
  })
  @ManyToOne(() => Survey, (survey) => survey.question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parents_survey' })
  parentsSurvey: Survey;

  @Field(() => Int, { nullable: false })
  @Column({ name: 'question_no' })
  questionNumber: number;

  @Field(() => String, { nullable: false })
  @Column()
  content: string;

  @Field(() => [Choice])
  @OneToMany(() => Choice, (choice) => choice.parentsQuestion, { eager: true })
  choice: Choice[];

  // @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.question)
  // userAnswer: UserAnswer[];
}
