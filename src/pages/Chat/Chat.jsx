import './Chat.css';
import {useEffect, useRef, useState} from "react";
import {getAllConversations, getAllMessages, test_prod_url} from "../../api.js";
import {io} from "socket.io-client";
import {useParams} from "react-router-dom";
export default function Chat() {
    const {companyLink} = useParams();
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [msg, setMsg] = useState('');
    const socketRef = useRef(null);
    function handlerMessage(e,message){
        e.preventDefault();
        if (!message.trim()) return;
        if (socketRef.current && socketRef.current.connected) {
            console.log("message", message);
            socketRef.current.emit('message',{companyLink, message, roleId:0});
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
            const messages = await getAllMessages(companyLink);
            const convers = await getAllConversations(companyLink);
            setConversations(convers);
            setMessages(messages.data);
        })()
        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('disconnect');
            socket.disconnect();
            socketRef.current = null;
        }
    },[])
    return (
<div className="chat-layout">
    <aside className="chat-sidebar">
        <div className="chat-sidebar__header">
            <h2>Chats</h2>
            <input type="text" placeholder="Search chats..." />
        </div>

        <div className="chat-list">
            <div className="chat-item chat-item--active">
                <div className="chat-item__avatar">A</div>
                <div className="chat-item__info">
                    <h3>Alex Johnson</h3>
                    {/*<p>Hello, I need help...</p>*/}
                </div>
            </div>
        </div>
    </aside>
    <section className="chat">
        <div className="chat__header">
            <h2>Alex Johnson</h2>
        </div>
        <div className="chat__messages">
            {messages.map((el) => (
                <div className={`message message--${el.role_id ? 'employee' : 'client'}`} key={el.id}>
                    {el.msg}
                </div>
            ))}
        </div>
        <div className="chat__input">
            <input
                type="text"
                placeholder="Write a message..."
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
            />
            <button onClick={(e) => handlerMessage(e, msg)}>
                Send
            </button>
        </div>
    </section>

</div>)
}