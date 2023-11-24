import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Survey } from 'src/surveys/entities/survey.entity';
import { UserAnswer } from 'src/user-answers/entities/user-answer.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class UserSurvey {
  @Field(() => Int, { description: 'Uers Survey ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Survey, {
    nullable: false,
    description: 'Parents Survey ',
  })
  @ManyToOne(() => Survey, (survey) => survey.userSurvey, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'original_survey' })
  originalSurvey: Survey;

  @Field(() => [UserAnswer])
  @OneToMany(() => UserAnswer, (UserAnswer) => UserAnswer.parentsUserSurvey)
  userAnswer: UserAnswer[];
}
