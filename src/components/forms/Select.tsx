import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  error?: boolean;
}

const Select: React.FC<SelectProps> = ({ options, error, className = '', ...props }) => {
  return (
    <select
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
        error ? 'border-red-300' : ''
      } ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
