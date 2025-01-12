import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/User";
import axios from "axios";

export const Dashboard = () => {
    const username = localStorage.getItem("username") || 'U';
    const token = localStorage.getItem("token") || '';
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!token) {
                console.warn("No token found. User might not be authenticated.");
                return;
            }

            try {
                console.log("Fetching balance with token:", token);
                const response = await axios.get("http://localhost:3000/api/v1/account/balance", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Balance response data:", response.data);
                setBalance(response.data.balance);
            } catch (error: any) {
                if (error.response) {
                    // Server responded with a status other than 2xx
                    console.error("Error fetching balance:", error.response.data);
                    alert(`Error: ${error.response.data.message || "Failed to fetch balance."}`);
                } else if (error.request) {
                    // Request was made but no response received
                    console.error("No response received:", error.request);
                    alert("Error: No response from server.");
                } else {
                    // Something else happened
                    console.error("Error setting up request:", error.message);
                    alert(`Error: ${error.message}`);
                }
            }
        };

        fetchBalance();
    }, [token]);

    return (
        <div>
            <Appbar initial={username[0]} />
            <div className="m-8">
                <Balance value={balance} />
                <Users />
            </div>
        </div>
    );
};