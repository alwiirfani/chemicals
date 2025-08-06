import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface CartdStatsProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

const CardStats: React.FC<CartdStatsProps> = ({
  title,
  description,
  icon,
  badge,
  children,
}) => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
        {icon} {badge}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default CardStats;
