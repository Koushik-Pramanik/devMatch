import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
    return(
        <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
          <Link to = "/" className="btn btn-ghost text-xl">DevTinder</Link>
        </div>
        <div className="flex gap-2">
          {user && (
          <div className="dropdown dropdown-end relative mx-5 flex items-center gap-2"> 
            <p className="text-lg font-bold">Welcome, {user.firstName}!</p>
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="user photo"
                  src={user.photoUrl} />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content absolute right-0 top-full z-10 mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg">
              <li>
                <Link to = "/profile" className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </Link>
              </li>
              <li><Link to= "/connections">Connections</Link></li>
              <li><Link to= "/requests">Request</Link></li>
              <li>
                <button type="button" onClick={handleLogout} className="text-red-500">
                  Logout
                </button>
              </li>
            </ul>
          </div>
          )}
        </div>
      </div>
    );
};

export default NavBar;