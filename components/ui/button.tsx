import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm hover:shadow-md active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 hover:border-blue-700",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 border border-red-600 hover:border-red-700",
        outline:
          "border-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200 hover:border-gray-300",
        ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-700",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-700",
        success:
          "bg-green-600 text-white hover:bg-green-700 border border-green-600 hover:border-green-700",
        warning:
          "bg-yellow-500 text-white hover:bg-yellow-600 border border-yellow-500 hover:border-yellow-600",
        teal: "bg-teal-600 text-white hover:bg-teal-700 border border-teal-600 hover:border-teal-700",
        purple:
          "bg-purple-600 text-white hover:bg-purple-700 border border-purple-600 hover:border-purple-700",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
