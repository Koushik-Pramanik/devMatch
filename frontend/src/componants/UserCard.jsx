import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user, showActions = true }) => {

    const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
    const dispatch = useDispatch();

    const handleSendRequest = async (status, userId) => {
        try{
            const res = await axios.post(
                BASE_URL + "/request/send/" + status + "/" + userId,
                {},
                {withCredentials: true}
            );
            dispatch(removeUserFromFeed(userId));
        }catch(err){}
    }
    return (
        <div className="card w-full max-w-sm overflow-hidden border border-base-300 bg-base-100 shadow-lg">
            <figure className="h-52 w-full bg-base-300">
                <img
                    src={photoUrl}
                    alt={`${firstName} ${lastName}`}
                    className="h-full w-full object-cover"
                />
            </figure>
            <div className="card-body items-center gap-2 p-5 text-center">
                <h2 className="card-title">{firstName} {lastName}</h2>
                {age && gender && <p className="text-sm opacity-70">{age}, {gender}</p>}
                {about && <p className="text-sm leading-relaxed">{about}</p>}
                {showActions && (
                    <div className="card-actions mt-2 justify-center">
                        <button className="btn btn-primary"
                            onClick={() => handleSendRequest("ignored", _id)}>Ignore
                        </button>
                        <button className="btn btn-primary"
                            onClick={() => handleSendRequest("interested", _id)}>Interested
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCard;