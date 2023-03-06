import { Controller, Get, Patch, Delete, UseGuards, ParseIntPipe} from '@nestjs/common';
import { HttpCode, Post } from '@nestjs/common/decorators';
import { Body, Param } from '@nestjs/common/decorators/http/route-params.decorator';
import { HttpStatus } from '@nestjs/common/enums';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ApiTags, ApiUnauthorizedResponse, ApiBearerAuth, ApiOperation, ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { UserObjDto } from './dto/user-obj.dto';

@ApiTags("User")
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({
    description: 'Unauthorized',
})

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

@Get('me')
@ApiOperation({ summary: 'Get current user' })
@ApiOkResponse({
    description: 'return user',
    type: UserObjDto,
})

getMe(@GetUser() user: User) {
    return user;
}

@Get(':id')
@ApiOperation({ summary: 'Get user by id' })
@ApiOkResponse({
    description: 'return user by id',
    type: UserObjDto,
})
getUserById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) userId: number,
){
    return this.userService.getUserById(userId)
}

@Patch('me')
@ApiOperation({ summary: 'Edit current user' })
@ApiOkResponse({
    description: 'return user',
    type: UserObjDto,
})

editMe(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
) {
    return this.userService.editUser(userId, dto);
}

@Patch(':id')
@ApiOperation({ summary: 'Edit user by id' })
@ApiOkResponse({
    description: 'return user',
    type: UserObjDto,
})

editUserById(
    @Param('id', ParseIntPipe) userId: number,
    @Body() dto: EditUserDto,
) {
    return this.userService.editUser(userId, dto);
}


@HttpCode(HttpStatus.NO_CONTENT)
@Delete('/me')
@ApiOperation({ summary: 'Delete current user' })
@ApiNoContentResponse({
    description:'Deleted successfully'
})

deleteMe(
    @GetUser('id') userId: number,
) {
    this.userService.deleteUser(userId);
}


@HttpCode(HttpStatus.NO_CONTENT)
@Delete(':id')
@ApiOperation({ summary: 'Delete user by id' })
@ApiNoContentResponse({
    description:'Deleted successfully'
})

deleteUserById(
    @Param('id', ParseIntPipe) userId: number,
) {
    this.userService.deleteUser(userId);
}
}