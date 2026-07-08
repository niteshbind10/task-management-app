import React, { forwardRef } from "react";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helperText,
      placeholder,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
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
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={`w-full px-4 py-3 text-sm bg-slate-900 border rounded-xl transition-all duration-200 outline-none appearance-none cursor-pointer text-slate-100
              ${
                error
                  ? "border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 shadow-sm shadow-rose-500/10"
                  : "border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 focus:shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]"
              }
              disabled:bg-slate-950 disabled:text-slate-500 disabled:border-slate-900`}
            {...props}
          >
            {placeholder && (
              <option value="" className="bg-slate-900">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
            ▼
          </div>
        </div>
        {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-slate-500">{helperText}</span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
