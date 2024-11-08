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
  constructor(private storeage: StorageService) {}

  create(createUserDto: CreateUserDto) {
    return this.storeage.addUser(createUserDto);
  }

  findAll() {
    return this.storeage.getAllUsers();
  }

  findOne(id: string) {
    const user = this.storeage.getUserById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  updateUserPassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    this.findOne(id);
    if (this.storeage.getUserPassword(id) !== updatePasswordDto.oldPassword)
      throw new ForbiddenException('OldPassword is wrong');
    return this.storeage.updateUserPassword(id, updatePasswordDto);
  }

  remove(id: string) {
    this.findOne(id);
    this.storeage.removeUser(id);
  }
}
