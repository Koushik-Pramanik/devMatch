import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";


const Requests = () => {
    const requests = useSelector((store) => store.requests)
    const dispatch = useDispatch();

    const reviewRequest = async (status, _id) => {
        try{
            const res = axios.post(
                BASE_URL + "/request/review/" + status + "/" + _id,
                {},
                {withCredentials: true}
            ); 
            dispatch(removeRequest(_id))
        }catch(err){

        }
    }
    const fetchRequest = async () =>{
        try{
            const res = await axios.get(BASE_URL + "/user/requests/received",{
                withCredentials: true
            });
            dispatch(addRequests(res.data.data));
        }catch(err){

        }
    }

    useEffect(() => {
        fetchRequest();
    },[])


    if(!requests) return;
    if(requests.length === 0) return <h1 className="my-10 text-center text-xl font-semibold">No Request Found</h1>

    return(
        <div className="mx-auto my-8 w-full max-w-2xl px-4">
            <h1 className="mb-6 text-center text-2xl font-bold">Connection Requests</h1>

            {requests.map((request) =>{
                const {_id, firstName, lastName, photoUrl, age, gender, about} = request.fromUserId;
                return(
                    <div key={_id} className="mb-4 flex items-center gap-4 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
                        <div className="shrink-0">
                            <img alt="photo" className="h-16 w-16 rounded-full object-cover" src={photoUrl} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="font-semibold">{firstName + " " + lastName}</h2>
                            {age && gender && (
                                <p className="text-sm text-base-content/70">{age}, {gender}</p>
                            )}
                            {about && <p className="mt-1 text-sm">{about}</p>}
                        </div>
                        <div className="flex shrink-0 justify-end gap-2">
                            <button className="btn btn-primary"
                                onClick={() => reviewRequest("accepted", request._id)}>Accept
                            </button>

                            <button className="btn btn-secondary"
                                onClick={() => reviewRequest("rejected", request._id)}>Rejected
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    );
   
}

export default Requests;