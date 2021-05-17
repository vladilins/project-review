import DataLoader from "dataloader";
import { Employee } from "../entities/Employee";

export const createEmployeeLoader = () =>
  new DataLoader<number, Employee>(async (employeeIds) => {
    const employees = await Employee.findByIds(employeeIds as number[]);
    const employeeIdToEmployee: Record<number, Employee> = {};
    employees.forEach((u) => {
      employeeIdToEmployee[u.id] = u;
    });

    const sortedEmployees = employeeIds.map(
      (employeeId) => employeeIdToEmployee[employeeId]
    );

    return sortedEmployees;
  });
