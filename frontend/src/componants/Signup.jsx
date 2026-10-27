import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({ ...current, [name]: value }));
        setError("");
    };

    const handleSignup = async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            await axios.post(BASE_URL + "/signup", formData);
            setIsSuccessful(true);
        } catch (err) {
            const message = err.response?.data;
            setError(
                typeof message === "string"
                    ? message
                    : "Unable to create your account. Please try again."
            );
            console.error("Signup failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-base-200">
            <div className="card w-96 bg-base-300 shadow-sm">
                <form className="card-body" onSubmit={handleSignup}>
                    <h2 className="card-title">Create your account</h2>

                    {isSuccessful ? (
                        <>
                            <p role="status">Account created successfully. You can now log in.</p>
                            <Link className="btn btn-primary" to="/login">Go to login</Link>
                        </>
                    ) : (
                        <>
                            <fieldset className="fieldset">
                                <label className="label" htmlFor="firstName">First name</label>
                                <input
                                    className="input"
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    maxLength={50}
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />

                                <label className="label" htmlFor="lastName">Last name</label>
                                <input
                                    className="input"
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    maxLength={50}
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />

                                <label className="label" htmlFor="signupEmail">Email</label>
                                <input
                                    className="input"
                                    id="signupEmail"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                                <label className="label" htmlFor="signupPassword">Password</label>
                                <input
                                    className="input"
                                    id="signupPassword"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <p className="text-sm opacity-70">
                                    Use at least 8 characters, including uppercase, lowercase, a number, and a symbol.
                                </p>
                            </fieldset>

                            {error && <p className="text-red-500" role="alert">{error}</p>}

                            <div className="card-actions justify-center">
                                <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating account..." : "Sign up"}
                                </button>
                            </div>
                            <p className="text-center text-sm">
                                Already have an account? <Link className="link link-primary" to="/login">Log in</Link>
                            </p>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Signup;
