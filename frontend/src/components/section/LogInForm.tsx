import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Icon from "../ui/Icon";
import FormField from "../ui/FormField";
import Button from "../ui/button";



export default function LogInForm() {
    return (
        <section className="flex flex-col w-md justify-center p-15 gap-[30px] bg-light-bg">
            <h2 className="title30-semi-bold">Log In</h2>
            <FormField label="Email"  placeholder="Enter your email" action="email" />
            <FormField label="Password"  placeholder="Enter your password" action="password" />
            <div className="flex flex-row items-center justify-center gap-[8px] text10-regular ">
                <Icon nameIcon="circle-alert" size={18} color='#F22D2D' />
                <span className="text-red-warning text12-regular">Incorrect email or password</span>
            </div>
            <div className="flex flex-row gap-2.5 text10-regular items-center justify-center">
                <span className="text-light-text">Don't have an account?</span>
                <a href="/signup" className="text-blue-800 ">Sign Up</a>
            </div>
            <Button text="Log in" size="lg" />
        </section>
    );
}