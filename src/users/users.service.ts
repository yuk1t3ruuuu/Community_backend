import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gender, User } from '../entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

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
    return this.usersRepository.findOne({ where: { id: userId } });
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

  async update(id: number, createUserDto:CreateUserDto){
    await this.usersRepository.update(id, {firstName: createUserDto.firstName, lastName:createUserDto.lastName})
  }


  findEmail(email:string){
    return this.usersRepository.find({where:{email:email}});
  }
}
