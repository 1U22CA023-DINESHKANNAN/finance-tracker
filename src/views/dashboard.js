import React, { useState, useEffect } from 'react';
import '../App.css';
import { useSearchParams } from 'react-router-dom';
import Axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import Chart from "chart.js/auto";
import { Doughnut,Bar } from "react-chartjs-2";
export default function Dashboard() {
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");

    const [transactionName, setTransactionName] = useState("");
    const [transactionAmount, setTransactionAmount] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [submitBtn, setSubmitBtn] = useState(false);
    const [totalExpence, setTotalExpence] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [availableBalance, setAvailableBalance] = useState(0);

    const [Doughnutlabel,setDoughnutlabel] = useState([])
    const [DoughnutData,setDoughnutData] = useState([])

    const [Barlabel,setBarlabel] = useState([])
    const [BarData,setBarData] = useState([])

    const navigate = useNavigate();
    const [TableData, setTableData] = useState([]);

    const [searchParams] = useSearchParams();
    const userQueryId = searchParams.get('id');
    const access = searchParams.get('access');
    const date = new Date()
    
    const DoughnutChartData = {
    datasets: [{
        data: DoughnutData,
        backgroundColor:["red","blue","green","yellow"]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: Doughnutlabel
    };

    const BarchartData = {
    datasets: [{
        data: BarData,
        backgroundColor:["red","blue","green","yellow"]
    }],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: Barlabel
    };
    useEffect(() => {
        Axios.post("http://localhost:2000/getAllData", { id: userQueryId })
            .then(res => {
                setUserName(res.data[0].FIRST_NAME);
            })
            .catch(error => console.error(error));
    }, [userQueryId]);

    useEffect(() => {
        Axios.get("http://localhost:2000/getAllTransactionData", {
            params: { id: userQueryId }
        })
            .then(res => {
                setTableData(res.data);
                setTotalRecords(res.data.length);
                
            })
            .catch(error => console.error(error));
    }, [submitBtn, userQueryId]);

    useEffect(() => {
        const IncomeDatas = TableData.filter(item => item.TRANSACTION_TYPE === 'Income');
        const Incomes = IncomeDatas.map(item => item.TRANSACTION_AMOUNT);
        const totalIncomeData = Incomes.reduce((acc, curr) => acc + curr, 0);

        const ExpenceDatas = TableData.filter(item => item.TRANSACTION_TYPE === 'Expence');
        const Expences = ExpenceDatas.map(item => item.TRANSACTION_AMOUNT);
        const totalExpenceData = Expences.reduce((acc, curr) => acc + curr, 0);
        const availableData = totalIncomeData - totalExpenceData;
        const todaysDate = date.toISOString().split("T")[0];
        const todaysData = ExpenceDatas.filter(item => item.DATE.split("T")[0] === todaysDate)

        const currentMonth = new Date().toISOString().slice(0, 7);           
        const thisMonthsData = ExpenceDatas.filter(item => item.DATE.slice(0, 7) === currentMonth);

        setDoughnutlabel(todaysData.map(item => item.TRANSACTION_NAME))
        setDoughnutData(todaysData.map(item => item.TRANSACTION_AMOUNT))

        setBarlabel(thisMonthsData.map(item => item.TRANSACTION_NAME))
        setBarData(thisMonthsData.map(item => item.TRANSACTION_AMOUNT))


        setTotalIncome(totalIncomeData);
        setTotalExpence(totalExpenceData);
        setAvailableBalance(availableData);
    }, [TableData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const transactionData = {
            name: transactionName,
            amount: transactionAmount,
            type: transactionType,
            userId: userQueryId,
        };
        console.log(transactionData)
        Axios.post("http://localhost:2000/addTransaction", transactionData)
            .then((response) => {
                console.log(response.data);
                setSubmitBtn(!submitBtn); // Trigger data reload

                // Clear input fields
                setTransactionName(''); 
                setTransactionAmount(''); 
                setTransactionType('');
            })
            .catch((error) => {
                console.error("There was an error submitting the transaction!", error);
            });
    };
    const handleDelete = (transactionId) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            Axios.delete("http://localhost:2000/deleteTransaction", {
                data: { id: transactionId }
            })
            .then((response) => {
                console.log(response.data);
                setSubmitBtn(!submitBtn); // Trigger data reload
            })
            .catch((error) => {
                console.error("There was an error deleting the transaction!", error);
            });
        }
    };
    return (
        
        <div className="container">
            <h1><span style={{color: 'rgb(70, 70, 70)'}}>Hello,</span>{userName}</h1>
            <div className="row">
                <div className="balance-block block">
                    <div className="balance-card card" style={{
                        background: "linear-gradient(135deg, #3ab5b0 0%, #3d99be 31%, #56317a 100%)",
                        backgroundRepeat: "no-repeat"
                    }}>
                        <h2>Available balance</h2>
                        <h1>{availableBalance}</h1>
                    </div>
                    <div className="expence-card card danger">
                        <h2>Total Expence</h2>
                        <h1>{totalExpence}</h1>
                    </div>
                    <div className="income-card card peace">
                        <h2>Total Income</h2>
                        <h1>{totalIncome}</h1>
                    </div>
                    <div className="record-card card primary">
                        <h2>Total Records</h2>
                        <h1>{totalRecords}</h1>
                    </div>
                </div>
                <div className="add-transaction block">
                    <h1>Add Transaction</h1>
                    <div className="add-transaction-container">
                        <form onSubmit={handleSubmit}>
                            <div className="transaction-name">
                                <label htmlFor="name"><h2>Transaction Name</h2></label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    value={transactionName} 
                                    onChange={(e) => setTransactionName(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="transaction-amount">
                                <label htmlFor="amount"><h2>Amount</h2></label>
                                <input 
                                    type="text" 
                                    id="amount" 
                                    value={transactionAmount} 
                                    onChange={(e) => setTransactionAmount(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="income-or-expence-selection-container">
                                <label><h2>Type</h2></label>
                                <input 
                                    type="radio" 
                                    id="income-select" 
                                    name="transaction-select" 
                                    value="Income" 
                                    checked={transactionType === "Income"}
                                    onChange={(e) => setTransactionType(e.target.value)} 
                                />
                                <label htmlFor="income-select"><span>Income</span></label>
                                <input 
                                    type="radio" 
                                    id="expence-select" 
                                    name="transaction-select" 
                                    value="Expence" 
                                    checked={transactionType === "Expence"}
                                    onChange={(e) => setTransactionType(e.target.value)} 
                                />
                                <label htmlFor="expence-select"><span>Expence</span></label>
                            </div>
                            <div>
                                <button className="add-to-list-button primary" type="submit">Add To List</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="row row2">
                <div className="analytics-block block">
                    <h1>Today's Expence</h1>
                    <Doughnut data ={DoughnutChartData}/>
                </div>
                <div className="analytics-block block">
                    <h1>This Month's Expence</h1>
                    <Bar data={BarchartData} />
                </div>
            </div>
            <div className="row3">
                <div className="block">
                    <h1>All Transactions</h1>
                    <table>
                        <thead>
                            <tr>
                                <th><h2>S.No</h2></th>
                                <th><h2>Category</h2></th>
                                <th><h2>Income / Expence</h2></th>
                                <th><h2>Amount</h2></th>
                                <th><h2>Actions</h2></th>
                            </tr>
                        </thead>
                        <tbody>
                            {TableData.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{transaction.TRANSACTION_NAME}</td>
                                    <td>{transaction.TRANSACTION_TYPE}</td>
                                    <td>{transaction.TRANSACTION_AMOUNT}</td>
                                    <td>
                                        <button className="primary"><Link to={`/update?tid=${transaction.TRANSACTION_ID}&uid=${userQueryId}`} style={{color:"white"}} >Edit</Link></button>
                                        <button 
                                            className="danger" 
                                            onClick={() => handleDelete(transaction.TRANSACTION_ID)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
