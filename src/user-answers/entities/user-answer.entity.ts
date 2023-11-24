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

  // @Field(() => Question, {
  //   nullable: false,
  //   description: 'Question ID',
  // })
  // @ManyToOne(() => Question, (question) => question.userAnswer, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'survey_question' })
  // question: Question;
  @Field(() => Int, { nullable: false, description: 'Question ID' })
  @Column({ name: 'question_id' })
  questionId: number;

  @Field(() => Int, { nullable: false, description: 'selectChoiceNumberId' })
  @Column({ name: 'select_choice_number__id' })
  selectChoiceNumberId: number;

  @Field(() => Int, { nullable: false, description: 'point' })
  @Column({ name: 'point' })
  point: number;
}
