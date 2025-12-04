// upload.controller.ts
import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "src/comments/dto/update-user.dto";
import type { MyRequest } from "src/type";
import { MainGuard } from "src/auth-strategy/main.guard";

@Controller("/api/users")
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post(":user_id")
    update(@Param("user_id") userId: string, @Body() data: UpdateUserDto) {

        return this.usersService.update(userId, data)
    }
}
