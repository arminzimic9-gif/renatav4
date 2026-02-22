import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  withArrow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  withArrow = false,
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-3 rounded-full font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 active:scale-95 cursor-pointer";

  const variants = {
    // Primary: Deep Trusted Blue, slight shine
    primary: "bg-brand-blue text-white hover:bg-brand-blueDark hover:shadow-lg hover:-translate-y-1 pl-8 pr-4 py-3 border border-transparent shadow-md shadow-brand-blue/20",

    // Secondary: Teal, fresh
    secondary: "bg-brand-teal text-white hover:bg-cyan-700 hover:shadow-lg hover:-translate-y-1 pl-8 pr-8 py-4 border border-transparent shadow-md shadow-brand-teal/20",

    // Accent: Wine, emotional connection
    accent: "bg-brand-wine text-white hover:bg-red-900 hover:shadow-lg hover:-translate-y-1 pl-8 pr-8 py-4 border border-transparent shadow-md shadow-brand-wine/20",

    // White: Clean card action
    white: "bg-white text-brand-dark hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 pl-6 pr-6 py-2 border border-gray-100 shadow-sm",

    // Outline: Professional
    outline: "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white pl-8 pr-8 py-3 bg-transparent",

    // Ghost: Text only
    ghost: "bg-transparent text-brand-text hover:text-brand-blue pl-4 pr-4 py-2 hover:bg-brand-blue/5"
  };

  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg px-8 py-4", // Larger touch target
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {withArrow && (
        <div className={`transition-transform duration-300 group-hover:translate-x-1 ${variant === 'ghost' ? '' : 'bg-white/10 rounded-full p-[3px] ml-1'}`}>
          <ArrowRight size={16} strokeWidth={2} />
        </div>
      )}
    </button>
  );
};