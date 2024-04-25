
 export interface FormData {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }
  
  export interface SignupFormProps {
    formData: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSendCode: () => void;
    code: string;
    handleCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleVerifyCode: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    isSignupEnabled: boolean;
  }

  interface Option {
    value: string;
    label: string;
}

export interface InputFieldProps {
    id: string;
    name: string;
    type: string;
    value: string | number;
    onChange: (e: any) => void;
    isLoading?: boolean;
    label: string;
    placeholder?: string;
    options?: Option[]; // Optional, only for select input type
    textarea?: boolean; // Optional, if the input should render as a textarea
}

  export interface SendCodeButtonProps {
    onClick: () => void;
  }

  export interface VerifyCodeSectionProps {
    code: string;
    onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onVerify: () => void;
  }