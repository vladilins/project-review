import { ObjectType, Field } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  // ManyToMany,
} from "typeorm";
// import { Employee } from "./Employee";

@ObjectType()
@Entity()
export class Review extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field()
  status: boolean;

  // @Field()
  // @ManyToMany(() => Employee, (employees) => employees.reviews)
  // reviewers: Employee[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
