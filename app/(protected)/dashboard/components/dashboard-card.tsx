import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
}

export function DashboardCard({
  title,
  icon,
  badge,
  children,
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex text-sm font-medium gap-2">
          {title} {badge}
        </CardTitle>

        {icon}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
