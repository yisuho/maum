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

  @Field(() => Int, {
    nullable: false,
    description: 'Original Survey Id(Base Survey ID)',
  })
  originalSurveyId: number;

  @Field(() => String, {
    nullable: false,
    description: 'Complete User Survey Title',
  })
  title: string;

  @Field(() => String, {
    nullable: false,
    description: 'Complete User Survey Description',
  })
  description: string;

  @Field(() => String, {
    nullable: false,
    description: 'Complete User Survey Footer',
  })
  footer: string;

  @Field(() => Int, {
    nullable: false,
    description: 'Complete User Survey Total Score',
  })
  totalScore: number;

  @Field(() => [CompletAnswer], {
    nullable: false,
    description: 'Complete User Survey Question',
  })
  question: CompletAnswer[];
}

@ObjectType()
export class CompletAnswer {
  @Field(() => Int, { nullable: false, description: 'Answer ID' })
  id: number;

  @Field(() => Int, { nullable: false, description: 'Question No.' })
  questionNumber: number;

  @Field(() => String, {
    nullable: false,
    description: ' Question Content',
  })
  content: string;

  @Field(() => Int, {
    nullable: false,
    description: ' User Question Select Choice ID',
  })
  selectChoiceId: number;

  @Field(() => Int, {
    nullable: false,
    description: 'User Question Select Choice Point',
  })
  point: number;

  @Field(() => [Choice], {
    nullable: false,
    description: 'Choices Included In Question ',
  })
  choice: Choice[];
}
