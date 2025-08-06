import { JwtPayload } from "jsonwebtoken";

// User Object dan JWT Payload
export interface UserAuth extends JwtPayload {
  userId: string;
  roleId: string;
  email: string;
  name: string;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
  exp: number;
  iat: number;
}
