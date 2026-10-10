import {Controller, Get, Param, Query, Req} from "@nestjs/common";
import {ChatService} from "./chat.service.js";
import type {Request} from 'express';

@Controller('api/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}
    @Get('client/messages')
    getAllMessages(@Req() req:Request, @Query('companyLink') companyLink: string, @Query('senderId') senderId: string) {
      const visitorId = req.cookies.visitorId;
      return this.chatService.getAllMessages(companyLink, Number(senderId), visitorId);
    }
    @Get('admin/conversations/:companyLink')
    getAllConversations(@Param('companyLink') companyLink: string) {
        return this.chatService.getAllConversations(companyLink);
    }
}