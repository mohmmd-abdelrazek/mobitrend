import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { InputFieldProps } from '@/src/types/signup';

const InputField = ({
  id,
  name,
  type,
  value,
  onChange,
  isLoading,
  label,
  placeholder,
  options = [], // For select input
  textarea = false // Flag to render textarea
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const renderInput = () => {
    if (textarea) {
      return (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={isLoading}
          placeholder={placeholder ? placeholder : ''}
          className="text-md block h-28 w-full text-gray-700 shadow-sm transition duration-150 ease-in-out placeholder:text-gray-400 focus:outline-none"
        />
      );
    } else if (type === 'select') {
      return (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={isLoading}
          className="text-md block w-full text-gray-700 shadow-sm transition duration-150 ease-in-out placeholder:text-gray-400 focus:outline-none"
        >
          <option value={""}></option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          type={typeFunction()}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={isLoading}
          required
          placeholder={placeholder ? placeholder : name}
          className="text-md block w-full text-gray-700 shadow-sm transition duration-150 ease-in-out placeholder:text-gray-400 focus:outline-none"
        />
      );
    }
  };

  const typeFunction = () => {
    if ((name === 'password' && showPassword) || (name === 'passwordConfirm' && showConfirmPassword)) {
      return 'text';
    } else {
      return type;
    }
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-md mb-1 font-bold text-gray-600 sm:text-sm"
      >
        {label}
      </label>
      <div className="flex items-center rounded-lg border border-gray-400 bg-white px-4 py-1 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50">
        {renderInput()}
        {(name === "password" || name === "passwordConfirm") && (
          <div className="cursor-pointer">
            <span onClick={() => name === "password" ? setShowPassword(prev => !prev) : setShowConfirmPassword(prev => !prev)}>
              {name === "password" ? showPassword ? <FaEyeSlash /> : <FaEye /> : showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
