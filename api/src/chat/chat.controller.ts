import {Controller, Get, Param, ParseIntPipe, Query, Req} from "@nestjs/common";
import {ChatService} from "./chat.service.js";
import type {Request} from 'express';

@Controller('api/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}
    @Get('client/messages')
    getAllMessages(@Req() req:Request, @Query('companyLink') companyLink: string, @Query('senderId') senderId: string,
                   @Query('conversationId') conversationId: string,) {
      const visitorId = req.cookies.visitorId;
      return this.chatService.getAllMessages(companyLink, Number(senderId), visitorId, Number(conversationId));
    }
    @Get('admin/conversations/:companyLink')
    getAllConversations(@Param('companyLink') companyLink: string) {
        return this.chatService.getAllConversations(companyLink);
    }
    @Get('admin/conversations/user/:userId/:conversationId')
    updateConversationUser(@Param('userId', ParseIntPipe) userId: number,
       @Param('conversationId', ParseIntPipe) conversationId: number) {
       return this.chatService.updateConversationUser(userId, conversationId);
    }
}