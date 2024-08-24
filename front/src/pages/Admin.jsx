import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import '../assets/styles/Admin.css';
import '../enums/UserRole';
import { userRoleLabels } from "../enums/UserRole";
import {useTranslation} from "react-i18next";

const userColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 400 },
    {
        field: 'role',
        headerName: 'Role',
        width: 200,
        renderCell: (params) => userRoleLabels[params.value],
    },
     { field: 'login_id', headerName: 'Login Id', width: 400 },
];

const conversationColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
];

const chatMessageHistoryColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'conversation_id', headerName: 'ConversationId', width: 70 },
    { field: 'user_id', headerName: 'UserId', width: 70 },
    { field: 'message_number', headerName: 'MessageNumber', width: 70 },
    {
        field: 'content',
        headerName: 'Content',
        width: 800,
        renderCell: (params) => (
          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
            {params.value.map((item, index) => (
              <div key={index}>
                <strong>{item.index}行目</strong>, {item.person}：{item.content} (<strong>Role:</strong> {item.role}),
              </div>
            ))}
          </div>
        ),
    },
];

function Admin({rootURL}) {
    const { t } = useTranslation();
    const [chatMessageHistory, setChatMessageHistory] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: '', login_id: '' });

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const fetchUsers = useCallback(async () => {
        if (!rootURL) {
            console.error("rootURL is not defined");
            return;
        }
        try {
            const response = await axios.get(`${rootURL}/user/list`);
            setUsers(response.data);
        } catch (error) {
            window.alert("ユーザーの取得に失敗しました");
        }
    }, [rootURL]);

    const fetchConversations = useCallback(async () => {
        if (!rootURL) {
            console.error("rootURL is not defined");
            return;
        }
        try {
            const response = await axios.get(`${rootURL}/conversation/list`);
            setConversations(response.data);
        } catch (error) {
            window.alert("対話一覧の取得に失敗しました");
        }
    }, [rootURL]);

    const fetchChatMessageHistory = useCallback(async () => {
        if (!rootURL) {
            console.error("rootURL is not defined");
            return;
        }
        try {
            const response = await axios.get(`${rootURL}/chat-message-history/list`);
            setChatMessageHistory(response.data);
        } catch (error) {
            window.alert("対話履歴一覧の取得に失敗しました");
        }
    }, [rootURL]);

    useEffect(() => {
        fetchUsers();
        fetchConversations();
        fetchChatMessageHistory()
    }, [fetchChatMessageHistory, fetchConversations, fetchUsers]);

    const handleUserAdd = async () => {
        try {
            const response = await axios.post(`${rootURL}/user/create`, newUser);
            alert('新しいユーザーが追加されました');
            setUsers([...users, response.data]);
            setNewUser({ id: '', name: '', email: '', role: '', login_id: '' });
            await fetchUsers();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                alert('入力に誤りがあります。再確認してください。');
            } else {
                alert('ユーザーの追加に失敗しました。');
            }
        }
    };

    return (
        <div className="admin-container">
            <h1>t{'admin.title'}</h1>
            <div className="sub-container">
                <h2>{t('admin.users.list.title')}</h2>
                <DataGrid
                    className="table"
                    rows={users}
                    columns={userColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 5},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </div>
            <div className="sub-container">
                <h2>{t('admin.users.create.title')}</h2>
                <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    placeholder={t('admin.users.create.name')}
                />
                <input
                    type="text"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    placeholder={t('admin.users.create.email')}
                />
                <input
                    type="text"
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserChange}
                    placeholder={t('admin.users.create.role')}
                />
                <button onClick={handleUserAdd}>{t('admin.users.create.title')}</button>
            </div>
            <div className="sub-container">
                <h2>{t('admin.conversation.list.title')}</h2>
                <DataGrid
                    className="table"
                    rows={conversations}
                    columns={conversationColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 5},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </div>
            <div className="sub-container">
                <h2>{t('admin.conversation.history.title')}</h2>
                <DataGrid
                    className="table"
                    rows={chatMessageHistory}
                    columns={chatMessageHistoryColumns}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 5},
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </div>
        </div>
    );
}

export default Admin;
