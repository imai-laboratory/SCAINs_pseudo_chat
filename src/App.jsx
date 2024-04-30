import './assets/styles/App.css';
import { UserStatements } from "./components/UserStatements";
import React, { useState, useEffect } from 'react';
import sampleData from './assets/data/sample.js'

function App() {
    const [userStatement, setUserStatements] = useState([]);
    useEffect(() => {
            const filteredData = sampleData.filter(item => item.person === "B");
            setUserStatements(filteredData[0].content)
        });

    return (
    <section className="app-container">
        <div className="chat-box-container">
          <UserStatements userStatement={userStatement}/>
        </div>
    </section>
    );
}

export default App;
