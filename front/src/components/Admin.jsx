import React, {useEffect, useState} from 'react';
import axios from "axios";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import '../assets/styles/Admin.css';
import '../enums/UserRole';
import { userRoleLabels } from "../enums/UserRole";

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
];

const conversationColumns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 130 },
];

function Admin({ rootURL }) {
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]);
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

    const fetchUsers = async () => {
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
    };

    const fetchConversations = async () => {
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
    };

    useEffect(() => {
        fetchUsers();
        fetchConversations();
    }, []);

    const handleUserAdd = async () => {
        try {
            const response = await axios.post(`${rootURL}/user/create`, newUser);
            alert('新しいユーザーが追加されました');
            setUsers([...users, response.data]);
            setNewUser({ id: '', name: '', email: '', role: '' });
            fetchUsers();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                alert('入力に誤りがあります。再確認してください。');
            } else {
                alert('ユーザーの追加に失敗しました。');
            }
        }
    };

    const handleConversationAdd = async () => {
        try {
            const response = await axios.post(`${rootURL}/conversation/create`, newConversation);
            alert('対話'+ response.data.name + 'が追加されました');
            setNewConversation({ name: '' });
            fetchConversations();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                alert('入力に誤りがあります。再確認してください。');
            } else {
                alert('対話の追加に失敗しました。');
            }
        }
    };

    return (
        <div className="admin-container">
            <h1>管理画面</h1>
            <div className="sub-container">
                <h2>ユーザーリスト</h2>
                <DataGrid
                    className="table"
                    rows={users}
                    columns={userColumns}
                    initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </div>
            <div className="sub-container">
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
                    placeholder="権限 (0:admin, 1:user)"
                />
                <button onClick={handleUserAdd}>ユーザを追加</button>
            </div>
            <div className="sub-container">
                <h2>対話リスト</h2>
                <DataGrid
                    className="table"
                    rows={conversations}
                    columns={conversationColumns}
                    initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </div>
            <div className="sub-container">
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
