import './assets/styles/App.css';
import React, { useState, useEffect } from 'react';
import sampleData from './assets/data/sample.js'
import {Chats, UserStatements} from "./components/index";

function App() {
    const [chats, setChats] = useState([]);
    const [userStatement, setUserStatements] = useState();

    useEffect(() => {
        const chatsData = sampleData.filter(item => item.person !== "user");
        const userData = sampleData.filter(item => item.person === "user");
        setChats(chatsData);
        setUserStatements(userData[0].content);
    }, []);

    return (
    <section className="app-container">
        <div className="chat-box-container">
            <Chats chats={chats}/>
            <UserStatements userStatement={userStatement} />
        </div>
    </section>
    );
}

export default App;
