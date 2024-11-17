import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { StorageService } from 'src/storage/storage.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DatabaseService } from 'src/database/databse.service';

@Injectable()
export class UserService {
  constructor(
    private database: DatabaseService,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.database.addUser(createUserDto);
  }

  findAll() {
    return this.database.getAllUsers();
  }

  async findOne(id: string) {
    const user = await this.database.getUserById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async updateUserPassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    await this.findOne(id);
    const currentPassword = await this.database.getUserPassword(id);
    if (currentPassword !== updatePasswordDto.oldPassword)
      throw new ForbiddenException('OldPassword is wrong');
    return this.database.updateUserPassword(id, updatePasswordDto);
  }

  async remove(id: string) {
    await this.findOne(id);
    this.database.removeUser(id);
  }
}
