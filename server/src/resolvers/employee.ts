import {
  Arg,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { Employee } from "../entities/Employee";
import { isAuth } from "../middleware/isAuth";

@InputType()
class EmployeeInput {
  @Field()
  username: string;
  @Field()
  email: string;
}

@Resolver()
export class EmployeeResolver {
  @Mutation(() => Employee)
  @UseMiddleware(isAuth)
  async createEmployee(@Arg("input") input: EmployeeInput): Promise<Employee> {
    return Employee.create({ ...input }).save();
  }

  @Mutation(() => Int)
  @UseMiddleware(isAuth)
  async updateEmployee(
    @Arg("input") input: EmployeeInput,
    @Arg("id", () => Int) id: number
  ) {
    await Employee.update({ id }, input);
    return id;
  }

  @Mutation(() => Int)
  @UseMiddleware(isAuth)
  async deleteEmployee(@Arg("id", () => Int) id: number) {
    await Employee.delete({ id });
    return id;
  }

  @Query(() => [Employee])
  @UseMiddleware(isAuth)
  employees(): Promise<Employee[]> {
    return Employee.find();
  }
}
