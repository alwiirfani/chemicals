"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth-store";

interface LoginResponseProps {
  user: {
    userId: string;
    roleId: string;
    email: string;
    name: string;
    role: string;
    status: string;
    createdAt: string;
    lastLogin: string;
  };
}

export default function LoginForm() {
  const { email, password, error, setEmail, setPassword, setError } =
    useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post<LoginResponseProps>(
        "/api/v1/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log(data.user.name);

      toast({
        title: "Login Berhasil",
        description: `Selamat datang, ${data.user.name}!`,
      });

      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.message || "Login gagal. Silakan coba lagi.";
        setError(message);
        toast({
          title: "Login gagal",
          description: message,
          variant: "destructive",
        });
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Sedang Masuk...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}
