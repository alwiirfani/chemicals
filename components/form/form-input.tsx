"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  id: string;
  label: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
  error,
  hint,
  className,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} <span className="text-red-500">{required ? "*" : ""}</span>
      </Label>
      <Input
        id={id}
        className={className}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        disabled={disabled}
      />
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
