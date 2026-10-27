import { useState } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({user}) => {
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const[photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
    const [age, setAge] = useState(user.age || "");
    const [gender, setGender] = useState(user.gender || "");
    const [about, setAbout] = useState(user.about || "");
    const[error, setError] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const dispatch = useDispatch();

    const saveProfile = async () =>{
        setError("");
        setIsSaved(false);
        const profileData = {
            firstName,
            lastName,
            about,
        };

        if (photoUrl.trim()) profileData.photoUrl = photoUrl.trim();
        if (age !== "") profileData.age = Number(age);
        if (gender) profileData.gender = gender;

        try{
            const res = await axios.patch(
                BASE_URL + "/profile/edit",
                profileData,
                {withCredentials: true}
            );
            dispatch(addUser({
                ...user,
                ...res.data?.data,
                ...profileData,
            }));
            setIsSaved(true);
        } catch (err) {
            setError(err.response?.data || err.message);
        }
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-base-200 px-4 py-8 lg:flex-row lg:gap-12">
            <section className="w-full max-w-md">
                <div className="card w-full max-w-md bg-base-300 shadow-sm">
                    <div className="card-body">
                        <h2 className="card-title">Edit Profile</h2>
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value);
                                    setIsSaved(false);
                                }}
                                className="input w-full"
                                placeholder="First name"
                            />

                            <label className="label" htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value);
                                    setIsSaved(false);
                                }}
                                className="input w-full"
                                placeholder="Last name"
                            />

                            <label className="label" htmlFor="age">Age</label>
                            <input
                                type="number"
                                id="age"
                                min="18"
                                value={age}
                                onChange={(e) => {
                                    setAge(e.target.value);
                                    setIsSaved(false);
                                }}
                                className="input w-full"
                                placeholder="Age"
                            />

                            <label className="label" htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                value={gender}
                                onChange={(e) => {
                                    setGender(e.target.value);
                                    setIsSaved(false);
                                }}
                                className="select w-full"
                            >
                                <option value="" disabled>Select gender</option>
                                {!["male", "female", "other"].includes(gender) && gender && (
                                    <option value={gender}>{gender}</option>
                                )}
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>

                            <label className="label" htmlFor="photoUrl">Photo</label>
                            <input
                                type="text"
                                id="photoUrl"
                                value={photoUrl}
                                onChange={(e) => {
                                    setPhotoUrl(e.target.value);
                                    setIsSaved(false);
                                }}
                                className="input w-full"
                                placeholder="Photo URL"
                            />

                            <label className="label" htmlFor="about">About</label>
                            <textarea
                                id="about"
                                value={about}
                                onChange={(e) => {
                                    setAbout(e.target.value);
                                    setIsSaved(false);
                                }}
                                className="textarea w-full"
                                placeholder="Tell us about yourself"
                                rows="4"
                            />
                        </fieldset>
                        {error && <p role="alert" className="text-error">{error}</p>}
                        <div className="card-actions justify-center">
                            <button type="button" className="btn btn-primary" onClick={saveProfile}>Save</button>
                        </div>
                        {isSaved && (
                            <div role="status" className="alert alert-success mt-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Your profile has been updated.</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <section className="w-full max-w-sm">
                <h2 className="mb-4 text-center text-lg font-semibold">Profile Preview</h2>
                <div className="flex justify-center">
                    <UserCard user={{ firstName, lastName, photoUrl, age, gender, about }} />
                </div>
            </section>

        </main>
        
    );
};

export default EditProfile;