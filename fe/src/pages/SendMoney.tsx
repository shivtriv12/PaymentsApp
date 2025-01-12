import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export const SendMoney = () => {
    const [searchParams] = useSearchParams();
    const firstname = searchParams.get("firstname") ?? "";
    const lastname = searchParams.get("lastname") ?? "";
    const username = searchParams.get("username") ?? "";
    const [amount, setAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const navigate = useNavigate();
    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div
                    className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg"
                >
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h2 className="text-3xl font-bold text-center">Send Money</h2>
                    </div>
                    {message && (
                        <div className="text-center text-green-500">
                            {message}
                        </div>
                    )}
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">
                                    {firstname ? firstname.charAt(0).toUpperCase() : "U"}
                                </span>
                            </div>
                            <h3 className="text-2xl font-semibold">
                                {firstname && lastname ? `${firstname} ${lastname}` : "User"}
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter amount"
                                    min="1"
                                />
                            </div>
                            
                            <button
                                type="button"
                                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                onClick={async () => {
                                    const response = await axios.post("http://localhost:3000/api/v1/account/transfer", {
                                        to: username,
                                        amount
                                    }, {
                                        headers: {
                                            Authorization: "Bearer " + localStorage.getItem("token")
                                        }
                                    })
                                    if (response.status === 200) {
                                        setMessage("Transfer successful!");
                                        setTimeout(() => {
                                            navigate("/dashboard");
                                        }, 3000);
                                    }
                                }}
                            >
                                Initiate Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};