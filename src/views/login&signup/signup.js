import '../../style-folder/loginORregister.css';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import Axios from 'axios'
function Registeration(){
    // navigate to login 
    const navigate = useNavigate();
    const handleClick = ()=>{
        navigate("/login");
    }

    // store values

    const [userData, setuserData] = useState({
        
    })

    const handleInput = (e) => {
        setuserData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    //requesting server to post data
    const postRequest = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:2000/register", userData)
            .then(res => {
                if (res.data[1] === "success") {
                    console.log(res.data[0]);
                    navigate(`/?access=true&id=${res.data[2]}`);
                } else if (res.data[1] === "error") {
                    alert(res.data[0]);
                }
            })
            .catch(err => {
                console.error("Error during registration:", err);
            });
    };
        return(
        <div className="register-master">
            <div className="register-block">
                <div className="welcome-image-register">
                    <div className="login-switch-block">
                        <h3>Already have an account?</h3>
                        <button onClick={handleClick}>Login</button>
                    </div>
                </div>
                <form action="" method="post" className="registeration-form-block" onSubmit={postRequest}>
                    <h1 className="register-heading">Sign Up</h1>
                    <div className="input-block">
                        <input type="text" onChange={handleInput} id="fname" name="fname" required/>
                        <label htmlFor="fname">First Name</label>
                    </div>
                    
                    <div className="input-block">
                        <input type="text" onChange={handleInput} id="sname" name="sname" required/>
                        <label htmlFor="sname">Second Name</label>
                    </div>
                    <div className="input-block">
                        <input type="mail" onChange={handleInput} id="register-email" name="email" required/>
                        <label htmlFor="register-email">Email ID</label>
                    </div>
                    <div className="input-block">
                        <input type="password" pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{8,}$" title="Password must be at least 8 characters long, contain at least one uppercase letter and one symbol" onChange={handleInput} id="password" name="password" required/>
                        <label htmlFor="password">Create Password</label>
                    </div>
                    <div className="switchToOther">
                         <span>Already have an Account? <a href="/login" >Log In</a></span>
                    </div>
                    <div className="input-submit">
                        <input type="submit" value="Sign Up"/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registeration;