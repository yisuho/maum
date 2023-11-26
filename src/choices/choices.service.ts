import { QuestionsService } from './../questions/questions.service';
import { Injectable } from '@nestjs/common';
import { CreateChoiceInput } from './dto/create-choice.input';
import { UpdateChoiceInput } from './dto/update-choice.input';
import { Brackets, EntityManager } from 'typeorm';
import { Choice } from './entities/choice.entity';
import { CreateChoiceInfo } from './model/choices.model';

@Injectable()
export class ChoicesService {
  constructor(private questionsService: QuestionsService) {}

  async create(
    createChoiceInput: CreateChoiceInput,
    manager: EntityManager,
  ): Promise<Choice> {
    const { parentsQuestionId, choiceNumber, content, point } =
      createChoiceInput;

    await this.checkChoice(createChoiceInput, manager);

    const findparentsQuestion = await this.questionsService.findOne(
      parentsQuestionId,
      manager,
    );

    const createChoiceInfo: CreateChoiceInfo = {
      parentsQuestion: findparentsQuestion,
      choiceNumber,
      content,
      point,
    };

    const createChoice = manager.create(Choice, createChoiceInfo);
    const saveChoice = await manager.save(Choice, createChoice);
    return saveChoice;
  }

  async findOne(id: number, manager: EntityManager): Promise<Choice> {
    const findOne = await manager
      .createQueryBuilder(Choice, 'choice')
      .leftJoinAndSelect('choice.parentsQuestion', 'question.id')
      .where('choice.id=:id', { id })
      .getOne();

    if (!findOne) {
      throw new Error('해당 보기가 없습니다.');
    }
    return findOne;
  }

  async findChoiceIncludQuestion(
    parentsQuestionId: number,
    manager: EntityManager,
  ): Promise<Choice[]> {
    const findChoiceIncludQuestion = await manager
      .createQueryBuilder(Choice, 'choice')
      .where('choice.parentsQuestion =:parentsQuestionId', {
        parentsQuestionId,
      })
      .getMany();
    return findChoiceIncludQuestion;
  }

  async update(
    id: number,
    updateChoiceInput: UpdateChoiceInput,
    manager: EntityManager,
  ): Promise<Choice> {
    const findChoice = await this.findOne(id, manager);

    const checkInfo: CreateChoiceInput = {
      parentsQuestionId: findChoice.parentsQuestion.id,
      choiceNumber: updateChoiceInput.choiceNumber,
      content: updateChoiceInput.content,
      point: updateChoiceInput.point,
    };

    await this.checkChoice(checkInfo, manager, id);

    await manager.update(Choice, id, updateChoiceInput);
    const updateChoiceResult = await this.findOne(id, manager);
    return updateChoiceResult;
  }

  async remove(id: number, manager: EntityManager): Promise<boolean> {
    const choice = await this.findOne(id, manager);
    const removeChoice = await manager.remove(Choice, choice);
    if (removeChoice.id) {
      return false;
    }
    return true;
  }

  async checkChoice(
    checkInfo: CreateChoiceInput,
    manager: EntityManager,
    excludeId?: number,
  ): Promise<Choice> {
    const { parentsQuestionId, choiceNumber, content, point } = checkInfo;
    const queryBuilder = manager
      .createQueryBuilder(Choice, 'choice')
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
