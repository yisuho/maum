import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Question } from 'src/questions/entities/question.entity';
import { UserSurvey } from 'src/user-surveys/entities/user-survey.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Choice } from 'src/choices/entities/choice.entity';

@ObjectType()
@Entity()
export class UserAnswer {
  @Field(() => Int, { description: 'User Answer ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => UserSurvey, {
    nullable: false,
    description: 'Parents UserSurvey ',
  })
  @ManyToOne(() => UserSurvey, (userSurvey) => userSurvey.userAnswer, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parents_user_survey' })
  parentsUserSurvey: UserSurvey;

  @Field(() => Int, { nullable: false, description: 'Question ID' })
  @Column({ name: 'question_id' })
  questionId: number;

  @Field(() => Int, { nullable: false, description: 'Select Choice Number Id' })
  @Column({ name: 'select_choice_number__id' })
  selectChoiceId: number;

  @Field(() => Int, { nullable: false, description: 'point' })
  @Column({ name: 'point' })
  point: number;
}

@ObjectType()
export class CompleteUserSurvey {
  @Field(() => Int, { nullable: false, description: 'User Survey Id' })
  id: number;

  @Field(() => Int, { nullable: false, description: 'Original Survey Id' })
  originalSurveyId: number;

  @Field(() => String, {
    nullable: false,
    description: 'Complete User Survey ID',
  })
  title: string;

  @Field(() => String, {
    nullable: false,
    description: 'Complete User Survey ID',
  })
  description: string;

  @Field(() => String, {
    nullable: false,
    description: 'Complete User Survey ID',
  })
  footer: string;

  @Field(() => Int, { nullable: false, description: 'Complete User Survey ID' })
  totalScore: number;

  @Field(() => [CompletAnswer], {
    nullable: false,
    description: 'Complete User Survey ID',
  })
  question: CompletAnswer[];
}

@ObjectType()
export class CompletAnswer {
  @Field(() => Int, { nullable: false, description: 'Complete User Survey ID' })
  id: number;

  @Field(() => Int, { nullable: false, description: 'Complete User Survey ID' })
  questionNumber: number;

  @Field(() => String, {
    nullable: false,
    description: 'Complete User Survey ID',
  })
  content: string;
  @Field(() => Int, { nullable: false, description: 'Complete User Survey ID' })
  selectChoiceId: number;

  @Field(() => Int, { nullable: false, description: 'Complete User Survey ID' })
  point: number;

  @Field(() => [Choice], {
    nullable: false,
    description: 'Complete User Survey ID',
  })
  choice: Choice[];
}
