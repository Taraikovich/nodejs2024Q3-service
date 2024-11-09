import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { StorageService } from 'src/storage/storage.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(private storage: StorageService) {}

  create(createUserDto: CreateUserDto) {
    return this.storage.addUser(createUserDto);
  }

  findAll() {
    return this.storage.getAllUsers();
  }

  findOne(id: string) {
    const user = this.storage.getUserById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  updateUserPassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    this.findOne(id);
    if (this.storage.getUserPassword(id) !== updatePasswordDto.oldPassword)
      throw new ForbiddenException('OldPassword is wrong');
    return this.storage.updateUserPassword(id, updatePasswordDto);
  }

  remove(id: string) {
    this.findOne(id);
    this.storage.removeUser(id);
  }
}
