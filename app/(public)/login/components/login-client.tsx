"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical } from "lucide-react";
import LoginGuide from "@/components/login-guide";
import LoginForm from "./login-form";
import Footer from "@/components/footer";
import { useLogin } from "@/stores/use-login";

export default function LoginClient() {
  const { setEmail, setPassword } = useLogin();
  const [activeTab, setActiveTab] = useState("login");

  const handleQuickLogin = (quickEmail: string, quickPassword: string) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute bg-blue-300 opacity-50 w-14 h-14 rounded-full z-0  border border-background" />
              <FlaskConical className="relative h-8 w-8 text-blue-600 z-10" />
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
              Sistem Manajemen Inventaris Kimia
            </h1>
          </div>
          <p className="text-gray-600">
            Sistem manajemen dan pelacakan inventaris bahan kimia laboratorium.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="demo">Akun Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                  Sistem manajemen dan pelacakan inventaris bahan kimia
                  laboratorium.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />

                <div className="mt-6 text-center text-sm text-gray-600">
                  <p className="mt-1">
                    Beralih ke tab &quot;Akun Demo&quot; untuk melihat semua
                    kredensial yang tersedia
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo">
            <LoginGuide onQuickLogin={handleQuickLogin} />
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => setActiveTab("login")}>
                Kembali ke Form Login
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
