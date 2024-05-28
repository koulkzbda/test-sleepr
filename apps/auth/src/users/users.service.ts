import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from './models/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    try {
      const user = await this.usersRepository.findOne({
        email: createUserDto.email,
      });

      if (user) {
        throw new ConflictException('A user with this email already exists');
      }
    } catch (err) {}

    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }
}
