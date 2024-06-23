"use client";
import { useState } from "react";
import { isAxiosError } from "axios";
import { axiosInstance } from "@/src/services/fetcher";
import useRedirectIfAuthenticated from "@/src/hooks/useRedirectIfAuthenticated";
import { SigninTextProps } from "@/src/types/textProps";
import { Link } from "@/src/navigation";
import InputField from "../InputField";
import { useRouter } from "@/src/navigation";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { useSearchParams } from "next/navigation";
import { mergeCart } from "@/src/services/mutate";

const SigninForm = (texts: SigninTextProps) => {
  useRedirectIfAuthenticated();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await axiosInstance.post("/auth/login", credentials);
      setIsLoading(false);
      await mutate("/auth/status");
      mergeCart();
      mutate("/user/profile");
      toast.success("logged in successfully");
      router.push(redirectPath ?? "/");
    } catch (error) {
      setIsLoading(false);
      if (isAxiosError(error)) {
        console.log(error.response?.data);
        setError(error.response?.data.message || "Failed to sign in");
      } else {
        setError(texts.error);
      }
    }
  };

  return (
    <form
      className="w-full max-w-md space-y-6 rounded-md bg-white sm:max-w-md sm:px-4"
      onSubmit={handleSubmit}
    >
      <InputField
        id="email"
        name="email"
        type="email"
        value={credentials.email}
        onChange={handleChange}
        isLoading={isLoading}
        label={texts.email}
        placeholder={texts.emailPlaceholder}
      />
      <div>
        <InputField
          id="password"
          name="password"
          type="password"
          value={credentials.password}
          placeholder={texts.passwordPlaceholder}
          onChange={handleChange}
          isLoading={isLoading}
          label={texts.password}
        />
        <Link
          href="/signup"
          className="mt-1 block w-full text-right font-medium text-gray-600 hover:text-orange-500 hover:underline"
        >
          forgot password?
        </Link>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`mx-auto mt-4 block w-full rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white transition duration-150 ease-in-out hover:scale-105 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 sm:w-2/5 ${isLoading ? "cursor-not-allowed opacity-50" : "opacity-100"} sm:text-md`}
      >
        {isLoading ? texts.signingIn : texts.signIn}
      </button>
      {error && (
        <p className="mt-2 text-center text-sm text-red-600 sm:text-sm">
          {error}
        </p>
      )}
      <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-gray-600">
          {texts.donotHaveAccount}
          <Link
            href={redirectPath ? `/signup?redirect=${redirectPath}` : "/signup"}
            className="font-medium text-orange-600 hover:text-orange-500 hover:underline"
          >
            {texts.createAccount}
          </Link>
        </p>
    </form>
  );
};

export default SigninForm;
