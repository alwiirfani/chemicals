// User Object dan JWT Payload
export interface UserAuth {
  userId: string;
  roleId: string;
  email: string;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}
