import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: string;
  rows?: number;
}

const Input = forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      id,
      type = "text",
      rows = 4,
      ...props
    },
    ref
  ) => {
    const isTextArea = type === "textarea";
    const inputStyles = `w-full px-4 py-3 text-sm bg-slate-900 border rounded-xl transition-all duration-200 outline-none text-slate-100 placeholder-slate-500
      ${leftIcon ? "pl-11" : ""}
      ${rightIcon ? "pr-11" : ""}
      ${
        error
          ? "border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm shadow-rose-500/10"
          : "border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]"
      }
      disabled:bg-slate-950 disabled:text-slate-500 disabled:border-slate-900`;

    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold text-slate-400 select-none tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 text-slate-500 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          
          {isTextArea ? (
            <textarea
              id={id}
              ref={ref}
              rows={rows}
              className={`${inputStyles} resize-none`}
              {...(props as any)}
            />
          ) : (
            <input
              id={id}
              type={type}
              ref={ref}
              className={inputStyles}
              {...(props as any)}
            />
          )}

          {rightIcon && (
            <div className="absolute right-4 text-slate-500 cursor-pointer flex items-center justify-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-slate-500">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
