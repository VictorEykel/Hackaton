import { twMerge } from "tailwind-merge";
import Section from "../section";

interface FooterProps {
    classmame?: string;
}

export default function Footer(props : FooterProps){
    return(
        <Section className={twMerge("border-t border-gray-200 p-6", props.classmame)}>
            <div className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} TravelAI. All rights reserved.
            </div>
        </Section>
    )
}