import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender, User } from '../entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { cache } from 'joi';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> { 
    return this.usersRepository.find();
  }

  findOne(userId: User['id']): Promise<User | undefined> {
    try{
      return this.usersRepository.findOne({ where: { id: userId } });
    }catch{
      throw new Error("ユーザー情報の取得に失敗しました")
    }
    
  }
  
  findOneForName(username: User['firstName']): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { firstName: username } });
  }

  createUser(firstName: string, lastName: string, email: string, password:string, description: string,
             gender: Gender, image: string) {
    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.isActive = true;
    newUser.password = password;
    newUser.email = email;
    newUser.description = description;
    newUser.gender = gender
    newUser.image = image;
    this.usersRepository.insert(newUser);
    return newUser.id;
  }

  async remove(id: number): Promise<void> { 
    await this.usersRepository.delete(id);
  }

  async updateUser(id:number, update:{
    image?:string;
    fistName?:string;
    description?:string;
  }){
    try{
      await this.usersRepository.update(
        id,{
          image:update.image,
          firstName:update.fistName,
          description:update.description
        }
      )
    }catch(error){
      throw new Error("更新に失敗しました")
    }
    
  }


  findEmail(email:string){
    return this.usersRepository.find({where:{email:email}});
  }
}
