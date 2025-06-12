import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={`bg-white shadow-md p-6 rounded-lg ${className}`}
    >
      {children}
    </div>
  );
};
