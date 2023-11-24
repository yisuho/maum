import { QuestionsService } from './../questions/questions.service';
import { UserSurveysService } from './../user-surveys/user-surveys.service';
import { SurveysService } from './../surveys/surveys.service';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserAnswerInput } from './dto/update-user-answer.input';
import { Repository } from 'typeorm';
import {
  CompletAnswer,
  CompleteUserSurvey,
  UserAnswer,
} from './entities/user-answer.entity';
import { CreateAnswerInfo } from './model/user-answer.model';
import { Survey } from 'src/surveys/entities/survey.entity';

@Injectable()
export class UserAnswersService {
  constructor(
    @Inject('USER_ANSWER_REPOSITORY')
    private userAnswerRepository: Repository<UserAnswer>,
    private surveysService: SurveysService,
    private userSurveysService: UserSurveysService,
    private questionsService: QuestionsService,
  ) {}

  async create(createAnswerInfo: CreateAnswerInfo): Promise<UserAnswer[]> {
    const { parentsUserSurvey, userAnswer } = createAnswerInfo;

    const createUserAnswer = userAnswer.map(async (answer) => {
      // const findQuestion = await this.questionsService.findOne(
      //   answer.questionId,
      // );
      const createAnswer = this.userAnswerRepository.create({
        parentsUserSurvey,
        questionId: answer.questionId,
        selectChoiceNumberId: answer.selectChoiceId,
        point: answer.point,
      });
      const saveAnswer = this.userAnswerRepository.save(createAnswer);
      return saveAnswer;
    });
    const savedAnswers = await Promise.all(createUserAnswer);

    return savedAnswers;
  }

  async findAll(): Promise<UserAnswer[]> {
    return;
  }

  async completeUserSurvey(
    createUserAnswer: UserAnswer[],
    originalSurvey: Survey,
  ): Promise<CompleteUserSurvey> {
    const surveyQuestion = originalSurvey.question;
    let totalScore = 0;

    const completAnswers: CompletAnswer[] = surveyQuestion.flatMap(
      (question) => {
        return createUserAnswer
          .filter((answer) => question.id === answer.questionId)
          .map((answer) => {
            totalScore += answer.point;
            return {
              id: question.id,
              questionNumber: question.questionNumber,
              content: question.content,
              selectChoiceId: answer.selectChoiceNumberId,
              point: answer.point,
              choice: question.choice,
            };
          });
      },
    );
    const completeUserSurvey: CompleteUserSurvey = {
      id: originalSurvey.id,
      title: originalSurvey.title,
      description: originalSurvey.description,
      footer: originalSurvey.footer,
      totalScore,
      question: completAnswers,
    };
    return completeUserSurvey;
  }

  async findOne(id: number): Promise<UserAnswer> {
    return await this.userAnswerRepository
      .createQueryBuilder('userAnswer')
      .leftJoinAndSelect('userAnswer.questionNumber', 'question.questionNumber')
      .where('userAnswer.id=:id', { id })
      .getOne();
  }

  update(id: number, updateUserAnswerInput: UpdateUserAnswerInput) {
    return `This action updates a #${id} userAnswer`;
  }

  remove(id: number) {
    return `This action removes a #${id} userAnswer`;
  }
}
