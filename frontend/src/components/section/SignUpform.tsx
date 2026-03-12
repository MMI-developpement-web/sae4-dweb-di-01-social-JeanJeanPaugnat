import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import Icon from "../ui/Icon";
import FormField from "../ui/FormField";
import Button from "../ui/button";



export default function SignUpForm() {
    return (
        <section className="flex flex-col w-md justify-center p-15 gap-[30px] bg-light-bg">
            <h2 className="title30-semi-bold">Sign Up</h2>
            <FormField label="Username" required placeholder="username" action="text" />
            <FormField label="Email" required placeholder="Email" action="email" />
            <FormField label="Password" required placeholder="Password" action="password" />
            <div className="flex flex-row span10-regular items-center justify-center">
                <span className="">Already have account?</span>
                <a href="#" className="text-blue-800 text12-regular">Log in</a>
            </div>
            <Button text="Log in" size="lg" />
        </section>
    );
}