
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

  export interface InputFieldProps {
    id: string;
    name: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isLoading: boolean;
    label: string;
    placeholder?: string;
  }

  export interface SendCodeButtonProps {
    onClick: () => void;
  }

  export interface VerifyCodeSectionProps {
    code: string;
    onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onVerify: () => void;
  }