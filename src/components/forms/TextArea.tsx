import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, error, required, helpText, className = '', ...props }) => {
  return (
    <div>
      <div className="flex justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {helpText && (
          <span className="text-sm text-gray-500">{helpText}</span>
        )}
      </div>
      <div className="mt-1 relative rounded-md shadow-sm">
        <textarea
          className={`
            block w-full px-3 py-2
            border ${error ? 'border-red-300' : 'border-gray-300'}
            rounded-md
            shadow-sm
            placeholder-gray-400
            focus:outline-none
            focus:ring-1
            ${error 
              ? 'focus:ring-red-500 focus:border-red-500' 
              : 'focus:ring-indigo-500 focus:border-indigo-500'
            }
            disabled:bg-gray-50
            disabled:text-gray-500
            sm:text-sm
            min-h-[100px]
            resize-y
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${props.id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;
