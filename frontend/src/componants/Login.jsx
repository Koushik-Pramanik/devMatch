import {useState} from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    

    const handleLogin = async () => {
        
        try {
            const res = await axios.post(BASE_URL + '/login', { email, password },{withCredentials: true});
            dispatch(addUser(res.data));
            navigate('/');
        } catch (error) {
            setError(error?.response?.data )
            console.error('Login failed:', error);
        }
    };

    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
            <div className="card bg-base-300 w-96 shadow-sm">
                <div className="card-body">
                    <h2 className="card-title">Login</h2>
                    <fieldset className="fieldset">
                        <label className="label" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email}
                         onChange={(e) => setEmail(e.target.value)}
                          className="input" placeholder="Email" />

                        <label className="label" htmlFor="password">Password</label>
                        <input type="password" id="password" value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="input" placeholder="Password" />
                    </fieldset>
                    <p className="text-red-500">{error}</p>
                    <div className="card-actions justify-center">
                        <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                    </div>
                    <p className="text-center text-sm">
                        Don&apos;t have an account? <Link className="link link-primary" to="/signup">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;