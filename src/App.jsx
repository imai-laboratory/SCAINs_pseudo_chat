import './assets/styles/App.css';
import React, { useState, useEffect } from 'react';
import sampleData from './assets/data/sample.js'
import {Chats, UserStatements} from "./components/index";

function App() {
    const [userStatement, setUserStatements] = useState([]);
    useEffect(() => {
        const filteredData = sampleData.filter(item => item.person === "B");
        setUserStatements(filteredData[0].content)
    });

    return (
    <section className="app-container">
        <div className="chat-box-container">
            <Chats />
            <UserStatements userStatement={userStatement} />
        </div>
    </section>
    );
}

export default App;
