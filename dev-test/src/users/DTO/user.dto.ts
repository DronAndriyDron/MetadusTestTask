import {IsEmail, Matches, Length, MaxLength, IsNotEmpty, IsString, MinLength} from 'class-validator';

export class ReGisterDto {

    @IsEmail()
    @Matches(/^[^`'"]*$/)
    @Matches(/^[\w.-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
    @MaxLength(64)
    username: string

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    password: string

}

export class ChangePasswordDto {
    @IsString()
    @MinLength(8)
    @MaxLength(64)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    currentPassword :string

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    newPassword:string

    @IsString()
    @MinLength(8)
    @MaxLength(64)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    confirmPassword:string

}