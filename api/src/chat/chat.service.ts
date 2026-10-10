import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {ConversationEntity} from "./entities/conversation.entity.js";
import {Repository} from "typeorm";
import {MessageEntity, SenderType} from "./entities/message.entity.js";
import {MessageDto} from "./dto/message.dto.js";
import {CustomerEntity} from "../customers/entities/customer.entity.js";
import {CompanyEntity} from "../companies/entities/company.entity.js";

@Injectable()
export class ChatService {
constructor(@InjectRepository(ConversationEntity) private  readonly conversationDB: Repository<ConversationEntity>,
   @InjectRepository(MessageEntity) private readonly messageDB: Repository<MessageEntity>,
   @InjectRepository(CustomerEntity) private readonly customerDB: Repository<CustomerEntity>,
   @InjectRepository(CompanyEntity) private readonly companyDB: Repository<CompanyEntity>) {}
    async messageHandler(data:MessageDto){
       if(data.conversationId && data.senderId){
           const messageObj = this.messageDB.create({
               conversation:{id:data.conversationId},
               senderId:data.senderId,
               senderType: SenderType.EMPLOYEE,
               message: data.message
           });
           await this.messageDB.save(messageObj);
           return {roleId:1, msg: data.message, conversationId: data.conversationId};
       }else {
           const obj = {};
           if(data.senderId){
               const customer = await this.customerDB.findOneBy({id:Number(data.senderId)});
               if(!customer){
                   throw new NotFoundException('No such customer');
               }
               obj['customer'] = {id: customer?.id};
           }else {
               obj['clientId'] = data.visitorId;
           }
           console.log({obj, data});
           const conversation = await this.conversationDB.findOneBy({company:{link:data.companyLink},...obj});
           console.log({conversation});
           if(conversation?.id){
               const messageObj = this.messageDB.create({
                   conversation:{id:conversation.id},
                   senderId:data.senderId || data.visitorId,
                   senderType: SenderType.CLIENT,
                   message: data.message
               });
               await this.messageDB.save(messageObj);
               return {role_id:0, msg: data.message, conversationId: conversation.id};
           }else {
               const company = await this.companyDB.findOneBy({link:data.companyLink});
               const createConversation = this.conversationDB.create({
                   clientId:data.senderId||data.visitorId,
                   company:{id:company?.id}
               });
               const conversation = await this.conversationDB.save(createConversation);
               const messageObj = this.messageDB.create({
                   conversation:{id:createConversation.id},
                   senderId:data.senderId||data.visitorId,
                   senderType: SenderType.CLIENT,
                   message: data.message,
               });
               await this.messageDB.save(messageObj);
               return {role_id: 0, msg: data.message, conversationId: conversation.id};
           }
       }
    }

    async getAllMessages(link:string, senderId:number, visitorId:string) {
    const obj = {company:{link}};
    if(senderId){
        obj['customer'] = {id:senderId};
    }else {
        obj['clientId'] = visitorId;
    }
    const conversation = await this.conversationDB.findOneBy(obj);
    if(conversation?.id){
        const messages = await this.messageDB.find({where:{conversation:{id:conversation?.id}}});
        console.log({messages});
        return {data: messages.map(el => ({role_id:SenderType.EMPLOYEE === el.senderType, msg: el.message}))};
    }else {
        return {data:[]};
    }
   }

   async getAllConversations(link:string) {
    return await this.conversationDB.find({where:{company:{link}}, select:{customer:{firstName:true, lastName:true},
     clientId:true, user:{firstName:true, lastName:true}}, relations:['customer', 'user']});
   }
}