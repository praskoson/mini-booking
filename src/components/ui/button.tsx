import { cn } from "@/lib/utils";
import React, { type ComponentPropsWithoutRef } from "react";

const variants = {
  //   primary: "bg-[#FF8E00] hover:bg-[#FF7015]",
  primary: "bg-lime-600 hover:bg-lime-700",
  danger: "bg-red-600 hover:bg-red-800",
  outline: "bg-transparent border border-stone-100 h-[44px]",
};

interface Props extends ComponentPropsWithoutRef<"button"> {
  variant: keyof typeof variants;
}

const Button = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { className, variant, ...rest } = props;
  return (
    <button
      ref={ref}
      className={cn(
        variants[variant],
        "inline-flex cursor-default items-center justify-center rounded-xl px-6 py-3 text-sm text-white",
        className,
      )}
      {...rest}
    />
  );
});

Button.displayName = "Button";

export { Button };
