"use client";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RoleSelectProps {
  htmlFor: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  children?: React.ReactNode;
  required?: boolean;
}

export const FormSelect: React.FC<RoleSelectProps> = ({
  htmlFor,
  label,
  value,
  onChange,
  error,
  children,
  required = false,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label} <span className="text-red-500">{required ? "*" : ""}</span>
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
