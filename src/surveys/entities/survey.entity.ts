import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Survey {
  @Field(() => Int, { description: '' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: false })
  @Column()
  title: string;

  @Field(() => String, { nullable: false })
  @Column()
  content: string;

  @Field(() => String, { nullable: false })
  @Column()
  footer: string;
}
