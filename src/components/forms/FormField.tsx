import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  helpText?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  children,
  helpText,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-1">{children}</div>
      {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
