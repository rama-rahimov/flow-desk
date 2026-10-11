import './Chat.css';
import {useEffect, useRef, useState} from "react";
import {
    currentUser,
    getAllConversations,
    getAllMessages,
    getEmployees,
    givePermission,
    test_prod_url
} from "../../api.js";
import {io} from "socket.io-client";
import {useParams} from "react-router-dom";
export default function Chat() {
    const {companyLink} = useParams();
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState({});
    const [msg, setMsg] = useState('');
    const [name, setName] = useState('');
    const [perm, setPerm] = useState(true);
    const [user, setUser] = useState({});
    const [allEmployees, setAllEmployees] = useState([]);
    const socketRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    async function getConvMessage(e, messages, name, conv){
        e.preventDefault();
        setMessages(messages.map(el=>({role_id: el.senderType==='CLIENT', msg:el.message})));
        setName(name);
        setSelectedConv(conv);
        console.log({conv,user})
        if(conv.user.id === user.id){
            console.log('permm');
            setPerm(false);
        }
    }
    async function setSelectedUser(e,employee){
     e.preventDefault();
     console.log({employee, conversations, setSelectedConv});
     const permission = await givePermission(employee.id, selectedConv.id);
     if(permission.success){
         if(employee.id === user.id){
             console.log('permm');
             setPerm(false);
         }else {
             setPerm(true)
         }
     }
     setIsOpen(false);
    }
    function handlerMessage(e,message){
        e.preventDefault();
        if (!message.trim()) return;

        if (socketRef.current && socketRef.current.connected) {
            console.log("message", message, selectedConv.id);
            socketRef.current.emit('message',{companyLink, message, conversationId: selectedConv.id});
            setMsg('');
        }else {
            console.error("Сокет не подключен!");
        }
    }
    useEffect(() => {
        const socket = io(`${test_prod_url}`, {
            autoConnect: true,
            withCredentials: true,
            auth: {token: localStorage.getItem("token")}
        });
        socket.on('connect', () => {
            console.log('CONNECTED:', socket.id);
        });

        socket.on('connect_error', (err) => {
            console.error('CONNECT ERROR:', err.message);
        });

        socket.on('disconnect', (reason) => {
            console.log('DISCONNECTED:', reason);
        });
        socket.on('message', (msg) => {
            console.log('MessageEvv', msg);
            setMessages(prev => [...prev, msg]);
        })
        socketRef.current = socket;
        (async () => {
            const profile = await currentUser();
            setUser(profile??{role_id:3});
            if(profile.role_id !== 3){
                const convers = await getAllConversations(companyLink);
                setConversations(convers);
                if(profile.role_id === 1){
                 const employees = await getEmployees();
                 setAllEmployees(employees);
                }
            }else {
                const messages = await getAllMessages('', '', companyLink);
                setMessages(messages.data);
            }
        })();
        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            socket.disconnect();
            socketRef.current = null;
        }
    },[]);
    console.log({ isOpen, conversations });
    return (
   <div className="chat-layout">
    {user.role_id !== 3 ?
    <aside className="chat-sidebar">
        <div className="chat-sidebar__header">
            <h2>Chats</h2>
            <input type="text" placeholder="Search chats..." />
        </div>
        <div className="chat-list">
            {conversations.map((el, index) => (<div className="chat-item chat-item--active" key={index}
             onClick={(e) => getConvMessage(e, el.messages,
             `${el.customer?`${el.customer.firstName} ${el.customer.lastName}`:`Guest-${el.clientId.slice(0,5)}`}`, el)}>
                <div className="chat-item__avatar"></div>
                <div className="chat-item__info">
                    <h3>{el.customer?`${el.customer.firstName} ${el.customer.lastName}`:`Guest-${el.clientId.slice(0,5)}`}</h3>
                    {<p>{String(el.messages.at(-1).message).length>12?`${String(el.messages.at(-1).message)}...`:el.messages.at(-1).message}</p>}
                </div>
            </div>))}
        </div>
    </aside>:''}
    <section className="chat">
        <div className="chat__header">
            <h2>{name}</h2>
        </div>
        <div className="chat__messages">
            {messages.map((el,index) => (
                <div className={`message message--${user.role_id !== 3 && el.role_id ? 'employee' : 'client'}`} key={index}>
                    {el.msg}
                </div>
            ))}
        </div>
        {name?<div className="chat__input">
            <input
                type="text" disabled={perm}
                placeholder="Write a message..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
            />
            <button disabled={perm} onClick={(e) => handlerMessage(e, msg)}>
                Send
            </button>
            <button onClick={(e) => setIsOpen(true)}>
                Permission
            </button>
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button
                            className="modal__close"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>
                        <h2>Select one of the employees for give him permission</h2>
                        {
                            allEmployees.map((el, index) => (<div className="user-list">
                                    <div
                                        className="user-item"
                                        key={index}
                                        onClick={(e) => setSelectedUser(e,el,index)}
                                    >
                                        <div className="user-item__avatar">
                                            {el.firstName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="user-item__info">
                                            <h3>{el.firstName}</h3>
                                            <p>{el.email}</p>
                                        </div>
                                    </div>
                            </div>))
                        }
                    </div>
                </div>
            )}
        </div>:''}
    </section>

</div>)
}