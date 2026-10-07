import {Controller, Get, Query, Req, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {ChatService} from "./chat.service.js";
import type {Request} from 'express';

@Controller('api/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}
    @UseGuards(AuthGuard)
    @Get('client/messages')
    getAllMessages(@Req() req:Request, @Query('companyLink') companyLink: string, @Query('senderId') senderId: string) {
      const visitorId = req.cookies.visitorId;
      return this.chatService.getAllMessages(companyLink, Number(senderId), visitorId);
    }
}