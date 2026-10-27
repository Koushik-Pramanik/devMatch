import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  useEffect(() => {
    if (feed) return;

    const getFeed = async () => {
      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(res.data));
      } catch (err) {
        console.error("Error fetching feed:", err);
      }
    };

    getFeed();
  }, [dispatch, feed]);


  if (!feed) return <div className="my-10 text-center">Loading feed...</div>;
  if (feed.length === 0) {
    return <div className="my-10 text-center">No users found in your feed.</div>;
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;