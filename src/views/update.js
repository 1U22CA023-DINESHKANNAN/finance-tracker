import { useState} from 'react';
import { useSearchParams ,useNavigate} from 'react-router-dom';
import Axios from 'axios';
import '../style-folder/update.css'

function Update() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tid = searchParams.get('tid');
    const uid = searchParams.get('uid');

    const [updatedTransactionName, setupdatedTransactionName] = useState("");
    const [updatedTransactionAmount, setupdatedTransactionAmount] = useState("");
    const [updatedTransactionType, setupdatedTransactionType] = useState("");

    // Use useEffect to fetch the transaction data when the component mounts or when tid changes

    const handleUpdate = (e) => {
        e.preventDefault();
        const updateDetails = {
            utid: tid,
            utname: updatedTransactionName,
            utamount: updatedTransactionAmount,
            uttype: updatedTransactionType
        };

        Axios.post("http://localhost:2000/update", updateDetails)
            .then(res => {
                navigate(`/?access=true&id=${uid}`)
            })
            .catch(error => {
                console.error("Error updating transaction:", error);
            });
    };

    return (
        <div className="update-box-container">
            <form onSubmit={handleUpdate} className="updateform">
                <div className="transaction-name">
                    <label htmlFor="name" className="update-form-label"><h2>Transaction Name</h2></label>
                    <input 
                        type="text" 
                        id="name" 
                        onChange={(e) => setupdatedTransactionName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="transaction-amount">
                    <label htmlFor="amount" className="update-form-label"><h2>Amount</h2></label>
                    <input 
                        type="text" 
                        id="amount" 
                        onChange={(e) => setupdatedTransactionAmount(e.target.value)} 
                        required 
                    />
                </div>
                <div className="income-or-expense-selection-container">
                    <label className="update-form-label"><h2>Type</h2></label>
                    <input 
                        type="radio" 
                        id="income-select" 
                        name="transaction-select" 
                        value="Income" 
                        onChange={(e) => setupdatedTransactionType(e.target.value)} 
                    />
                    <label htmlFor="income-select"><span>Income</span></label>
                    <input 
                        type="radio" 
                        id="expense-select" 
                        name="transaction-select" 
                        value="Expense" 
                        onChange={(e) => setupdatedTransactionType(e.target.value)} 
                    />
                    <label htmlFor="expense-select"><span>Expense</span></label>
                </div>
                <div>
                    <label className="update-form-label"></label>
                    <button className="add-to-list-button primary" type="submit">Update</button>
                </div>
            </form>
        </div>
    );
}

export default Update;
