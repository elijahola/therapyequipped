import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', required, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>

        <input
          ref={ref}
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:outline-none focus:ring-2 transition-all duration-200
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error
              ? 'border-error focus:ring-error focus:border-error'
              : 'border-gray-300 focus:ring-brand-black focus:border-brand-black'
            }
            ${className}
          `.trim()}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${props.id}-error`}
            className="text-sm text-error flex items-center gap-1"
            role="alert"
          >
            <span aria-hidden="true">⚠</span>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${props.id}-helper`}
            className="text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
