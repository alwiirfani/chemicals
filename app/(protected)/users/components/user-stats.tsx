import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Shield } from "lucide-react";

interface UserStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    blocked: number;
    admins: number;
    laborans: number;
    regularUsers: number;
  };
}

export const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm">Total Pengguna</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">
            <span className="text-green-600">{stats.active} aktif</span> •{" "}
            <span className="text-gray-500">{stats.inactive} tidak aktif</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm">Pengguna Aktif</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.active}
          </div>
          <div className="text-xs text-muted-foreground">
            {stats.total > 0
              ? ((stats.active / stats.total) * 100).toFixed(1)
              : 0}
            % dari total
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm">Administrator</CardTitle>
          <Shield className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
          <div className="text-xs text-muted-foreground">
            {stats.laborans} laboran • {stats.regularUsers} pengguna
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm">Ditangguhkan</CardTitle>
          <UserX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
          <div className="text-xs text-muted-foreground">Akun bermasalah</div>
        </CardContent>
      </Card>
    </div>
  );
};
