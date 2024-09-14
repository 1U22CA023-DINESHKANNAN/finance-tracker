import '../../style-folder/loginORregister.css';
import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import Axios from 'axios';
function Login(){
    const navigate = useNavigate();
    const handleClick = ()=>{
        navigate("/register");
    }

        // login mismatch block
        const [loginWarning, setLoginWarning] = useState("")

    const [userLoginData, setUserLoginData] = useState({
        email:"",
        password:""
    });
    const handleInput = (e)=>{
        setUserLoginData(prev=>({...prev,[e.target.name]:[e.target.value]}))
        setLoginWarning("")
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        Axios.post("http://localhost:2000/login",userLoginData)
        .then(response => {
           if(response.data.status === "success"){
               navigate(`/?access=true&id=${response.data.result[0].ID}`)
           }
        })
        
    }

    return(
        <div className="register-master">
            <div className="register-block">
                <div className="welcome-image-register">
                    <div className="login-switch-block">
                        <h3>Don't have an account?</h3>
                        <button onClick={handleClick}>Sign Up </button>
                    </div>
                </div>
                <form action="" method="post" className="registeration-form-block" onSubmit={handleSubmit}>
                    <h1 className="register-heading">Log In</h1>
                    <span className="login-warning-message">{loginWarning}</span>
                    <div className="input-block">
                        <input type="mail" id="register-email" onChange={handleInput} name="email" required/>
                        <label htmlFor="register-email">Email ID</label>
                    </div>
                    <div className="input-block">
                        <input type="password" id="password" onChange={handleInput} name="password" required/>
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="switchToOther">
                         <span>Don't have an Account? <a href="/register" >Sign Up</a></span>
                    </div>
                    <div className="input-submit">
                        <input type="submit" value="Log In"/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;