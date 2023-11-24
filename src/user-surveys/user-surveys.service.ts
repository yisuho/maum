import { Inject, Injectable } from '@nestjs/common';
import { CreateUserSurveyInput } from './dto/create-user-survey.input';
import { UpdateUserSurveyInput } from './dto/update-user-survey.input';
import { Repository } from 'typeorm';
import { UserSurvey } from './entities/user-survey.entity';
import { Survey } from 'src/surveys/entities/survey.entity';

@Injectable()
export class UserSurveysService {
  constructor(
    @Inject('USER_SURVEY_REPOSITORY')
    private userSurveyRepository: Repository<UserSurvey>,
  ) {}
  async create(originalSurvey: Survey): Promise<UserSurvey> {
    const createUserSurvey = this.userSurveyRepository.create({
      originalSurvey,
    });
    const saveUserSurvey = await this.userSurveyRepository.save(
      createUserSurvey,
    );

    return saveUserSurvey;
  }

  findAll() {
    return `This action returns all userSurveys`;
  }

  async findOne(id: number): Promise<UserSurvey> {
    const userSurvey = await this.userSurveyRepository.findOne({
      where: { id },
    });
    return userSurvey;
  }

  update(id: number, updateUserSurveyInput: UpdateUserSurveyInput) {
    return `This action updates a #${id} userSurvey`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSurvey`;
  }
}
