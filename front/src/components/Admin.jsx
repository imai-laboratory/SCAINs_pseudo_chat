import React, {useState} from 'react';
import axios from "axios";

function Admin({ rootURL }) {
    const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
    const [newConversation, setNewConversation] = useState({ name: '' });

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleNewConversation = (e) => {
        const { name, value } = e.target;
        setNewConversation({ ...newConversation, [name]: value });
    };

    const handleUserAdd = () => {
        axios.post(`${rootURL}/user/create`, newUser)
            .then(response => {
                alert('新しいユーザーが追加されました');
                setNewUser({ name: '', email: '', role: '' });
            })
            .catch(error => {
                if (error.response && error.response.status === 422) {
                    alert('入力に誤りがあります。再確認してください。');
                } else {
                    alert('ユーザーの追加に失敗しました。');
                }
            });
    };

    const handleConversationAdd = () => {
        axios.post(`${rootURL}/conversations/create`, newConversation)
            .then(response => {
                alert('対話が追加されました');
                setNewConversation({ name: '' });
            })
            .catch(error => {
                if (error.response && error.response.status === 422) {
                    alert('入力に誤りがあります。再確認してください。');
                } else {
                    alert('ユーザーの追加に失敗しました。');
                }
            });
    };

    return (
        <div className="container">
            <div>
                <h2>新しいユーザーの追加</h2>
                <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    placeholder="ユーザー名"
                />
                <input
                    type="text"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    placeholder="email"
                />
                <input
                    type="text"
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserChange}
                    placeholder="権限"
                />
                <button onClick={handleUserAdd}>ユーザを追加</button>
            </div>
            <div>
                <h2>対話の追加</h2>
                <input
                    type="text"
                    name="name"
                    value={newConversation.name}
                    onChange={handleNewConversation}
                    placeholder="対話データ名"
                />
                <button onClick={handleConversationAdd}>対話追加</button>
            </div>
        </div>
    );
}

export default Admin;
