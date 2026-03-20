
import Icon from "../ui/Icon";
import FormField from "../ui/FormField";
import Button from "../ui/button";
import { Login } from "../../utils/UserData";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LogInForm() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const navigate = useNavigate();

      let handleLogin = async (email: string, password: string) => {
          let data = await Login(email, password);
          //  catch eror envoyé par le backend si error de email ou mot de passe, afficher message d'erreur activer la div error_message
              if (!data) {
                  const errorMessageDiv = document.getElementById("error_message");
                  if (errorMessageDiv) {
                      errorMessageDiv.classList.remove("hidden");
                  }
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
            <div id="error_message" className="hidden flex flex-row items-center justify-center gap-[8px] text10-regular ">
                <Icon nameIcon="circle-alert" size={18} color='#F22D2D' />
                <span className="text-red-warning text12-regular">Incorrect email or password</span>
            </div>
            <div className="flex flex-row gap-2.5 text10-regular items-center justify-center">
                <span className="text-light-text">Don't have an account?</span>
                <Link to="/signup" className="text-blue-800 ">Sign Up</Link>
            </div>
            <Button text="Log in" size="lg" onClick={() => handleLogin(email, password)} />
        </section>
    );
}