import React from "react";
import LoginClient from "./components/login-client";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account to continue",
};

const LogiPage = async () => {
  return <LoginClient />;
};

export default LogiPage;
