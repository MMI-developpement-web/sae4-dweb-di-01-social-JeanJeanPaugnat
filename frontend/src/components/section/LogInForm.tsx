
import Icon from "../ui/Icon";
import FormField from "../ui/FormField";
import Button from "../ui/button";
import { Login } from "../../utils/UserData";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LogInForm() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [errorMessage, setErrorMessage] = useState("");
      const navigate = useNavigate();

      let handleLogin = async (email: string, password: string) => {
          let data = await Login(email, password);
          if (data && data.error) {
                console.log(data.error);
                setErrorMessage(data.error);
                return;
          }
          if (data) {
              console.log("Login successful:", data);
              navigate("/feed");
          }
      }

    return (
        <section className="flex flex-col w-full h-dvh justify-center p-15 gap-[30px] bg-light-bg">
            <h2 className="title30-semi-bold">Log In</h2>
            <FormField label="Email"  placeholder="Enter your email" action="email" value={email}
        onChange={e => setEmail(e.target.value)}/>
            <FormField label="Password"  placeholder="Enter your password" action="password" value={password}
        onChange={e => setPassword(e.target.value)}/>
            {errorMessage && (
                <div className="flex flex-row items-center justify-center gap-[8px] text10-regular">
                    <Icon nameIcon="circle-alert" size={18} color='#F22D2D' />
                    <span className="text-red-warning text12-regular">{errorMessage}</span>
                </div>
            )}
            <div className="flex flex-row gap-2.5 text10-regular items-center justify-center">
                <span className="text-light-text">Don't have an account?</span>
                <Link to="/signup" className="text-blue-800 ">Sign Up</Link>
            </div>
            <Button text="Log in" size="lg" onClick={() => handleLogin(email, password)} />
        </section>
    );
}