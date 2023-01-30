import {HttpCode, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User} from './Models/users.model';
import * as bcrypt from 'bcrypt';
import {ChangePasswordDto} from "./DTO/user.dto";

@Injectable()
export class UsersService {
    constructor(@InjectModel('user') private readonly userModel: Model<User>) {
    }

    async insertUser(username: string, userpassword: string) {

        const saltOrRounds = 10;
        const password = await bcrypt.hash(userpassword, saltOrRounds);
        const checkIfExist = await this.userModel.findOne({username});
        if (checkIfExist !== null) {
            throw new HttpException('This user already exist in DB.', HttpStatus.CONFLICT)
        }
        const newUser = new this.userModel({
            username,
            password,
        });
        await newUser.save();
        return newUser;
    }

    async getUser(username: string) {
        const user = await this.userModel.findOne({username});
        return user;
    }

    async changeUserPassword(changePasswordDto: ChangePasswordDto,username:string) {
        const {currentPassword, newPassword, confirmPassword} = changePasswordDto;

        if (!currentPassword || !newPassword || !confirmPassword) {
            throw new HttpException("AL fields are required", HttpStatus.INTERNAL_SERVER_ERROR)
        }
        if (newPassword !== confirmPassword) {
            throw new HttpException("New password and confirm password not equals", HttpStatus.INTERNAL_SERVER_ERROR)
        }

        const user = await this.userModel.findOne({username});

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        const isValid = await bcrypt.compare(currentPassword, user.password)
        if (!isValid) {
            throw new HttpException("incorrect password", HttpStatus.INTERNAL_SERVER_ERROR)
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        return {msg: 'Password changed successfully'};

    }
}