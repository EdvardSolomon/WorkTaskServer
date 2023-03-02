import { Controller, Get, Patch, Delete, UseGuards, ParseIntPipe} from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { HttpStatus } from '@nestjs/common/enums';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

@Get('me')

getMe(@GetUser() user: User) {
    return user;
}

@Get(':id')


getUserById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) userId: number,
){
    return this.userService.getUserById(userId)
}

@Patch('me')

editMe(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
) {
    return this.userService.editUser(userId, dto);
}

@Patch(':id')

editUserById(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
) {
    return this.userService.editUser(userId, dto);
}


@HttpCode(HttpStatus.NO_CONTENT)
@Delete('/me')

deleteMe(
    @GetUser('id') userId: number,
) {
    this.userService.deleteUser(userId);
}


@HttpCode(HttpStatus.NO_CONTENT)
@Delete(':id')

deleteUserById(
    @Param('id', ParseIntPipe) userId: number,
) {
    this.userService.deleteUser(userId);
}
}