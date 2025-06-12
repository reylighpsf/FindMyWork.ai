import React from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "ghost";
  className?: string;
}

export function Button({ children, variant = "default", className = "", ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    default: "bg-teal-600 text-white hover:bg-teal-700",
    ghost: "bg-transparent hover:bg-gray-100 text-teal-800",
  };

  return (
    <button
      {...props}
      className={twMerge(base, variants[variant], className)}
    >
      {children}
    </button>
  );
}

export default Button;