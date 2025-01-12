import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface User {
    username: string;
    firstname: string;
    lastname: string;
    _id?: string;
}

interface UserProps {
    user: User;
}

export const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filter, setFilter] = useState<string>("");
    const token = localStorage.getItem("token") || '';

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/bulk", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {
                        filter: filter
                    }
                });
                setUsers(response.data.user);
            } catch (error: any) {
                if (error.response) {
                    console.error("Error fetching users:", error.response.data);
                    alert(`Error: ${error.response.data.message || "Failed to fetch users."}`);
                } else if (error.request) {
                    console.error("No response received:", error.request);
                    alert("Error: No response from server.");
                } else {
                    console.error("Error setting up request:", error.message);
                    alert(`Error: ${error.message}`);
                }
            }
        };

        if (filter.trim() !== "") {
            fetchUsers();
        }
        fetchUsers();
    }, [filter, token]);

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input 
                    onChange={(e) => setFilter(e.target.value)} 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full px-2 py-1 border rounded border-slate-200" 
                />
            </div>
            <div>
                {users.length > 0 ? (
                    users.map(user => <User key={user._id} user={user} />)
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </>
    );
}

const User: React.FC<UserProps> = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between items-center p-2 border-b">
            <div className="flex items-center">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center mr-4">
                    <span className="text-xl font-semibold">
                        {user.firstname.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div>
                    <p className="font-medium">{user.firstname} {user.lastname}</p>
                    <p className="text-sm text-gray-500">{user.username}</p>
                </div>
            </div>
            <div>
                <Button 
                    onClick={() => {
                        navigate(`/send?username=${user.username}&firstname=${user.firstname}&lastname=${user.lastname}`);
                    }} 
                    label="Send Money" 
                />
            </div>
        </div>
    );
};