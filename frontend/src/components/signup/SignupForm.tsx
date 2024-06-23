"use client";

import InputField from "../InputField";
import { useState } from "react";
import { useRouter } from "@/src/navigation";
import { axiosInstance } from "@/src/services/fetcher";
import { isAxiosError } from "axios";
import { SignupTextProps } from "@/src/types/textProps";
import Image from "next/legacy/image";
import signinIcon from "@/src/assest/signin.gif";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { useSearchParams } from "next/navigation";
import { mergeCart } from "@/src/services/mutate";

const SignupForm = (texts: SignupTextProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [code, setCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupEnabled, setIsSignupEnabled] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCode(e.target.value);

  const handleSendCode = async () => {
    try {
      let email = formData.email;
      await axiosInstance.post("/auth/send-verification-code", { email });
      setSuccessMessage("Verification code sent to your email.");
    } catch (error) {
      console.error("Error sending verification code:", error);
      setErrors(["Failed to send verification code."]);
    }
  };

  const handleVerifyCode = async () => {
    try {
      let email = formData.email;
      await axiosInstance.post("/auth/verify-code", { email, code });
      setIsSignupEnabled(true);
      setSuccessMessage("Code verified successfully!");
    } catch (error) {
      console.error("Error verifying code:", error);
      setErrors(["Failed to verify code."]);
    }
  };

  const validateEmail = (email: string): boolean => /\S+@\S+\.\S+/.test(email);

  const validatePassword = (password: string): boolean =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const validatePasswordMatch = (
    password: string,
    passwordConfirm: string,
  ): boolean => formData.password === formData.passwordConfirm;

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    if (!validateEmail(formData.email)) {
      newErrors.push("Invalid email format");
    }
    if (!validatePassword(formData.password)) {
      newErrors.push(
        "Password must be at least 8 characters long and include both letters and numbers",
      );
    }
    if (!validatePasswordMatch(formData.password, formData.passwordConfirm)) {
      newErrors.push("Password confirmation not match password");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMessage("");
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return; // Ensure this function validates all necessary fields effectively

    setIsLoading(true); // Assuming there is a state setter for loading state

    try {
      // Post the signup form data
      const response = await axiosInstance.post("/auth/signup", formData);

      // Handle the response from the signup
      if (response.data.success) {
        setSuccessMessage("Signup successful!");
        setErrors([]);
        toast.success("Congratulations! You have signed up successfully.");

        // Attempt to log in the user automatically
        const signinResponse = await axiosInstance.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        if (signinResponse.data.success) {
          await mutate("/auth/status");
          mergeCart();
          mutate("/user/profile");
          router.push(redirectPath ?? "/");
          toast.success("signed in successfully");
        } else {
          toast.error("Automatic login failed. Please try to log in manually.");
          setErrors([signinResponse.data.message || "Automatic login failed."]);
        }
      } else {
        toast.error(response.data.message || "Signup failed.");
        setErrors([response.data.message || "Signup failed."]);
      }
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        setErrors([
          error.response.data.error ||
            "An error occurred during the signup process.",
        ]);
        toast.error(
          error.response.data.error ||
            "An error occurred during the signup process.",
        );
      } else {
        setErrors(["An unexpected error occurred. Please try again."]);
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-6 rounded-md bg-white sm:max-w-md sm:px-4"
    >
      {/* <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
        <div>
          <Image
            className="rounded-full"
            src={signinIcon}
            alt={"signin icon"}
          ></Image>
        </div>

        <div className="text-semibold absolute bottom-0 w-full cursor-pointer select-none bg-slate-200 bg-opacity-80 py-4 text-center text-xs">
          Upload Photo
        </div>
        <input type="file" className="hidden" />
      </div> */}
      <InputField
        id="name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        isLoading={isLoading}
        label={texts.nameLabel}
      />
      <InputField
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        isLoading={isLoading}
        label={texts.emailLabel}
      />
      <InputField
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        isLoading={isLoading}
        label={texts.passwordLabel}
      />
      <InputField
        id="password-confirm"
        name="passwordConfirm"
        type="password"
        value={formData.passwordConfirm}
        onChange={handleChange}
        isLoading={isLoading}
        label={texts.confirmPasswordLabel}
      />
      {/* <button
        type="button"
        onClick={handleSendCode}
        className="mt-4 inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Send Verification Code
      </button>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Verification Code"
          value={code}
          onChange={handleCodeChange}
          className="mt-1 w-full flex-1 rounded-lg border-gray-300 px-4 py-2 text-sm shadow-sm transition duration-150 ease-in-out focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        />
        <button
          type="button"
          onClick={handleVerifyCode}
          className="mt-4 inline-flex justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-in-out hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 md:mt-0"
        >
          Verify Code
        </button>
      </div> */}

      <button
        type="submit"
        disabled={isLoading}
        className={`mx-auto mt-4 block w-full rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white transition duration-150 ease-in-out hover:scale-105 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 sm:w-2/5 ${isLoading ? "cursor-not-allowed opacity-50" : "opacity-100"} sm:text-md`}
      >
        {isLoading ? texts.signingUp : texts.signUpButton}
      </button>

      {successMessage && (
        <p className="text-center text-sm font-medium text-green-600">
          {successMessage}
        </p>
      )}
      {errors &&
        errors.map((error, index) => (
          <p key={index} className="text-center text-sm text-red-600">
            {error}
          </p>
        ))}
    </form>
  );
};

export default SignupForm;
