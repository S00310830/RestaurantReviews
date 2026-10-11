import { UserModel, IUser } from '../models/users';
import { HydratedDocument } from 'mongoose';

export class UserService {
  
 async getAllUsers(): Promise<IUser[]> {
 return await UserModel.find().lean(); 
 }

 async getUserById(id: string): Promise<IUser | null> {
 return await UserModel.findById(id).lean();
 }

 async createUser(userData: IUser): Promise<HydratedDocument<IUser>> {
 const user = new UserModel(userData);
 return await user.save();
 }

 async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
 return await UserModel.findByIdAndUpdate(id, userData, { returnDocument: 'after' }).lean();
 }

 async deleteUser(id: string): Promise<IUser | null> {
 return await UserModel.findByIdAndDelete(id).lean();
 }

}