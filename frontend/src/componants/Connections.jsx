import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import {addConnections} from "../utils/connectionSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const Connections = () => {
    const connections = useSelector((store) => store.connections)
    const dispatch = useDispatch();
    const fetchConnections = async () => {
        try{
            const res = await axios.get(BASE_URL + "/user/connections",{
                withCredentials: true
            });
            dispatch(addConnections(res.data.data))
        }catch(err){

        }
    }
    useEffect(() => {
        fetchConnections();
    },[]);

    if(!connections) return;
    if(connections.length === 0) return <h1 className="my-10 text-center text-xl font-semibold">No Connections Found</h1>

    return(
        <div className="mx-auto my-8 w-full max-w-2xl px-4">
            <h1 className="mb-6 text-center text-2xl font-bold">Connections</h1>

            {connections.map((connection) =>{
                const {_id, firstName, lastName, photoUrl, age, gender, about} = connection;
                return(
                    <div key={_id} className="mb-4 flex items-center gap-4 rounded-lg border border-base-300 bg-base-100 p-4 shadow-sm">
                        <div className="shrink-0">
                            <img alt="photo" className="h-16 w-16 rounded-full object-cover" src={photoUrl} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-semibold">{firstName + " " + lastName}</h2>
                            <p className="text-sm text-base-content/70">{age}, {gender}</p>
                            <p className="mt-1 text-sm">{about}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default Connections;