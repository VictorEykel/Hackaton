import { twMerge } from "tailwind-merge";

interface SectionProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Section(props: SectionProps) {
  return (
    <section className={twMerge("w-full p-8 rounded-lg", props.className)}>
      {props.children}
    </section>
  );
}
