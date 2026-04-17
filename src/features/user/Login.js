import { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';
import api from '../../axios';

function Login() {
    const INITIAL_LOGIN_OBJ = { password: "", emailId: "" };
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setLoginObj({ ...loginObj, [updateType]: value });
    }

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        if (!loginObj.emailId.trim()) return setErrorMessage("Email Id is required!");
        if (!loginObj.password.trim()) return setErrorMessage("Password is required!");

        setLoading(true);
        try {
            const resp = await api.post("/login", {
                email: loginObj.emailId,
                password: loginObj.password
            });

            localStorage.setItem("token", resp.data.access_token);
            localStorage.setItem("name", resp.data.user.name);

            api.defaults.headers.common['Authorization'] = `Bearer ${resp.data.access_token}`;

            setLoading(false);
            window.location.href = '/app/dashboard';
        } catch (error) {
            setLoading(false);
            setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    }

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl shadow-xl">
                <div className="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
                    <div><LandingIntro /></div>
                    <div className="py-24 px-10">
                        <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
                        <form onSubmit={submitForm}>
                            <div className="mb-4">
                                <InputText type="emailId" defaultValue={loginObj.emailId} updateType="emailId" containerStyle="mt-4" labelTitle="Email Id" updateFormValue={updateFormValue} />
                                <InputText defaultValue={loginObj.password} type="password" updateType="password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updateFormValue} />
                            </div>
                            <div className='text-right text-primary'>
                                <Link to="/forgot-password"><span className="text-sm inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Forgot Password?</span></Link>
                            </div>
                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button type="submit" className={"btn mt-2 w-full btn-primary" + (loading ? " loading" : "")}>{loading ? "Logging in..." : "Login"}</button>
                            <div className='text-center mt-4'>Don't have an account yet? <Link to="/register"><span className="inline-block hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Register</span></Link></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;