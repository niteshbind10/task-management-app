import User, { IUserModel } from "@/models/user.model";
import { makeRepository } from "@/repositories/base.repository";

export const UserRepository = makeRepository<IUserModel>(User);
