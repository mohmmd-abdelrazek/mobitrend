import { InputFieldProps } from "@/src/types/signup";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const InputField = ({
  id,
  name,
  type,
  value,
  onChange,
  isLoading,
  label,
  placeholder,
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const typeFunction = () => {
    if ((name === "password" && showPassword) || (name === "passwordConfirm" && showConfirmPassword)) {
      return "text"
    } else {
      return type
    }
  }
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-md mb-1 font-bold text-gray-600 sm:text-sm"
      >
        {label}
      </label>
      <div className="flex items-center rounded-lg border border-gray-500 bg-white px-4 py-1 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50">
      <input
        type={typeFunction()}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={isLoading}
        placeholder={placeholder ? placeholder : name}
        required
        className="text-md block w-full text-gray-700 shadow-sm transition duration-150 ease-in-out placeholder:text-gray-400 focus:outline-none"
      />
      {name === "password" && (
          <div className="cursor-pointer">
            <span onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}
        {name === "passwordConfirm" && (
          <div className="cursor-pointer">
            <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default InputField;
function setShowPassword(arg0: (prev: any) => boolean): void {
  throw new Error("Function not implemented.");
}
