import { DriverRepo } from "../../repositories/driver-repo/driver-repo";

export class DriverService{
  constructor(private readonly driverRepo:DriverRepo) {}
}