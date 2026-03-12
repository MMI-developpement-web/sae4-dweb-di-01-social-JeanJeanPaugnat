import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Icon from "../ui/Icon";
import Input from "../ui/Input";
import Button from "../ui/button";



export default function LogInForm() {
    return (
        <div className="flex flex-col items-center justify-center gap-[30px] bg-light-bg">
            <h2 className="title30-semi-bold">Log In</h2>
            <div className="">
                <span className="">Email</span>
                <Input placeholder="email" />
            </div>
            <div className="">
                <span className="">Password</span>
                <Input variant="secondary" placeholder="password" action="password" />
            </div>
            <div className="flex flex-row items-center gap-[8px] span10-regular ">
                <Icon nameIcon="circle-alert" size={18} color='#F22D2D' />
                <span className="text-red-warning text12-regular">Incorrect email or password</span>
            </div>
            <div className="span10-regular ">
                <span className="">Don't have an account? </span>
                <a href="#" className="text-blue-800 text12-regular">Sign up</a>
            </div>
            <Button text="Log in" size="lg" />
        </div>
    );
}