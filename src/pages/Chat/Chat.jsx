import './Chat.css';
import {useEffect, useState} from "react";
import {getAllMessages, test_prod_url} from "../../api.js";
import {io} from "socket.io-client";
import {useParams} from "react-router-dom";
export default function Chat() {
    const {companyLink} = useParams();
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState('');
    const socket = io(test_prod_url, {
        withCredentials: true
    });
    function handlerMessage(e,message){
        e.preventDefault();
        console.log("message", message);
        socket.emit("message", {companyLink, message});
    }
    useEffect(() => {
        (async () => {
            socket.on("connect", async () => {
                console.log("Emit!");
            });
            const messages = await getAllMessages(companyLink);
            if (messages.length > 0) {
                setMessages(messages);
            }
        })()
    },[]);
    socket.on("message",  (data) => {
        console.log('messageEvent',data)
        setMessages((prev) => [...prev, {roleId: data.roleId, msg: data.msg}]);
    })
    return (
        <div className="chat">
            <div className="chat__header">
                <h2>Chat</h2>
            </div>
            <div className="chat__messages">
                {messages.map((el, ind) => (
                    <div className={`message message--${el.role_id?'employee':'client'}`} key={ind}>{el.msg}</div>
                ))}
            </div>
            <div className="chat__input">
                <input
                    type="text"
                    placeholder="Write a message..."
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                />
                <button onClick={(e) => handlerMessage(e, msg)}>Send</button>
            </div>
        </div>
    )
}