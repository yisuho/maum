import { QuestionsService } from './../questions/questions.service';
import { Inject, Injectable } from '@nestjs/common';
import { CreateChoiceInput } from './dto/create-choice.input';
import { UpdateChoiceInput } from './dto/update-choice.input';
import { Brackets, Repository } from 'typeorm';
import { Choice } from './entities/choice.entity';
import { CreateChoiceInfo } from './model/choices.model';

@Injectable()
export class ChoicesService {
  constructor(
    @Inject('CHOICE_REPOSITORY')
    private choiceRepository: Repository<Choice>,
    private questionsService: QuestionsService,
  ) {}

  async create(createChoiceInput: CreateChoiceInput): Promise<Choice> {
    const { parentsQuestionId, choiceNumber, content, point } =
      createChoiceInput;

    await this.checkChoice(createChoiceInput);

    const findparentsQuestion = await this.questionsService.findOne(
      parentsQuestionId,
    );

    const createChoiceInfo: CreateChoiceInfo = {
      parentsQuestion: findparentsQuestion,
      choiceNumber,
      content,
      point,
    };

    const createChoice = this.choiceRepository.create(createChoiceInfo);
    const saveChoice = await this.choiceRepository.save(createChoice);
    return saveChoice;
  }

  async findOne(id: number): Promise<Choice> {
    // const findOne = await this.choiceRepository.findOne({ where: { id } });
    const findOne = await this.choiceRepository
      .createQueryBuilder('choice')
      .leftJoinAndSelect('choice.parentsQuestion', 'question.id')
      .where('choice.id=:id', { id })
      .getOne();

    if (!findOne) {
      throw new Error('해당 보기가 없습니다.');
    }
    return findOne;
  }

  async update(
    id: number,
    updateChoiceInput: UpdateChoiceInput,
  ): Promise<Choice> {
    const findChoice = await this.findOne(id);

    const checkInfo: CreateChoiceInput = {
      parentsQuestionId: findChoice.parentsQuestion.id,
      choiceNumber: updateChoiceInput.choiceNumber,
      content: updateChoiceInput.content,
      point: updateChoiceInput.point,
    };

    await this.checkChoice(checkInfo, id);

    await this.choiceRepository.update(id, updateChoiceInput);
    const updateChoiceResult = await this.findOne(id);
    return updateChoiceResult;
  }

  async remove(id: number): Promise<boolean> {
    const choice = await this.findOne(id);
    const removeChoice = await this.choiceRepository.remove(choice);
    if (removeChoice.id) {
      return false;
    }
    return true;
  }

  async checkChoice(
    checkInfo: CreateChoiceInput,
    excludeId?: number,
  ): Promise<Choice> {
    const { parentsQuestionId, choiceNumber, content, point } = checkInfo;
    const queryBuilder = this.choiceRepository
      .createQueryBuilder('choice')
      .where('choice.parentsQuestion = :parentsQuestionId', {
        parentsQuestionId,
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('choice.choiceNumber=:choiceNumber ', {
            choiceNumber,
          })
            .orWhere(' choice.point = :point', { point })
            .orWhere('choice.content = :content', { content });
        }),
      );

    if (excludeId) {
      queryBuilder.andWhere('choice.id !=:excludeId', { excludeId });
    }
    const checkChoice = await queryBuilder.getOne();

    if (checkChoice) {
      if (checkChoice.choiceNumber === choiceNumber) {
        throw new Error(
          '문제에 동일한 보기번호가 존재합니다,보기번호를 변경하세요',
        );
      } else if (checkChoice.point === point) {
        throw new Error(
          '문제에 동일한 점수의 번호가 존재합니다,번호 점수를 변경하세요',
        );
      } else if (checkChoice.content === content) {
        throw new Error(
          '문제에 동일한 보기내용이 존재합니다,보기내용을변경하세요',
        );
      }
    }

    return checkChoice;
  }
}
