import './Chat.css';
import {useState} from "react";
export default function Chat() {
    const [messages, setMessages] = useState([]);
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
                />
                <button>Send</button>
            </div>
        </div>
    )
}