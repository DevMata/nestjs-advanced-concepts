import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSourceService } from '../data-source/data-source.service';

@Injectable()
export class UsersService {
  //  NOTE: the scopes bubbles up through the dependency tree
  //    in this case DataSourceService is durable => UsersService is durable => UsersController is durable
  constructor(private readonly dataSourceService: DataSourceService) {
    console.log(this);
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
