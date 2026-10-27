import axios from "axios";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useSelector } from "react-redux";



const Body = () => {

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const userData = useSelector((store) => store.user);

    useEffect(() => {
        if (userData || ["/login", "/signup"].includes(location.pathname)) return;

        const fetchUser = async () => {
            try {
                const res = await axios.get(BASE_URL + "/profile/view", {
                    withCredentials: true,
                });
                dispatch(addUser(res.data));
            } catch (error) {
                if (error.status === 401) {
                    navigate("/login");
                }
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [dispatch, location.pathname, navigate, userData]);


    return(
        <div>
            <NavBar/>
            <Outlet />
            <Footer />
        </div>
    );
};


export default Body;