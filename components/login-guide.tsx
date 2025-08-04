"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  Eye,
  EyeOff,
  LogIn,
  Shield,
  GraduationCap,
  FlaskConical,
  Users,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Account {
  name: string;
  email: string;
  password: string;
  role: string;
  id: string;
  description: string;
  permissions: string[];
}

const accounts: Account[] = [
  {
    name: "Administrator",
    email: "admin@chemlab.com",
    password: "password123",
    role: "ADMIN",
    id: "12345",
    description: "Akses penuh sistem, manajemen pengguna, pengaturan sistem",
    permissions: [
      "Akses Penuh",
      "Manajemen Pengguna",
      "Pengaturan Sistem",
      "Semua Laporan",
      "Manajemen Database",
    ],
  },
  {
    name: "Dr. Siti Aminah, M.Si",
    email: "laboran1@chemlab.com",
    password: "password123",
    role: "LABORAN",
    id: "1234567890",
    description: "Manajemen lab, kontrol inventaris, persetujuan peminjaman",
    permissions: [
      "Manajemen Inventaris",
      "Persetujuan Peminjaman",
      "Manajemen SDS",
      "Laporan Lab",
      "Pemantauan Pengguna",
    ],
  },
  {
    name: "Ahmad Fauzi, S.Si",
    email: "laboran2@chemlab.com",
    password: "password123",
    role: "LABORAN",
    id: "1234567891",
    description: "Manajemen lab, kontrol inventaris, persetujuan peminjaman",
    permissions: [
      "Manajemen Inventaris",
      "Persetujuan Peminjaman",
      "Manajemen SDS",
      "Laporan Lab",
      "Pemantauan Pengguna",
    ],
  },
  {
    name: "Prof. Dr. Budi Santoso, M.Sc",
    email: "dosen1@chemlab.com",
    password: "password123",
    role: "DOSEN",
    id: "0123456789",
    description: "Materi pengajaran, proyek penelitian, koordinasi lab",
    permissions: [
      "Materi Pengajaran",
      "Proyek Penelitian",
      "Koordinasi Lab",
      "Laporan Akademik",
    ],
  },
  {
    name: "Dr. Rina Kartika, M.Si",
    email: "dosen2@chemlab.com",
    password: "password123",
    role: "DOSEN",
    id: "0123456790",
    description: "Materi pengajaran, proyek penelitian, koordinasi lab",
    permissions: [
      "Materi Pengajaran",
      "Proyek Penelitian",
      "Koordinasi Lab",
      "Laporan Akademik",
    ],
  },
  {
    name: "Andi Pratama",
    email: "mhs1@student.ac.id",
    password: "password123",
    role: "MAHASISWA",
    id: "20210001",
    description: "Akses mahasiswa, proyek akhir, peminjaman terawasi",
    permissions: ["Proyek Akhir", "Peminjaman Terawasi", "Akses Penelitian"],
  },
  {
    name: "Sari Dewi",
    email: "mhs2@student.ac.id",
    password: "password123",
    role: "MAHASISWA",
    id: "20210002",
    description: "Akses mahasiswa, proyek akhir, peminjaman terawasi",
    permissions: ["Proyek Akhir", "Peminjaman Terawasi", "Akses Penelitian"],
  },
  {
    name: "Rudi Hermawan",
    email: "mhs3@student.ac.id",
    password: "password123",
    role: "MAHASISWA",
    id: "20210003",
    description: "Akses mahasiswa, proyek akhir, peminjaman terawasi",
    permissions: ["Proyek Akhir", "Peminjaman Terawasi", "Akses Penelitian"],
  },
  {
    name: "Maya Sari",
    email: "mhs4@student.ac.id",
    password: "password123",
    role: "MAHASISWA",
    id: "20210004",
    description: "Akses mahasiswa, proyek akhir, peminjaman terawasi",
    permissions: ["Proyek Akhir", "Peminjaman Terawasi", "Akses Penelitian"],
  },
  {
    name: "Doni Setiawan",
    email: "mhs5@student.ac.id",
    password: "password123",
    role: "MAHASISWA",
    id: "20210005",
    description: "Akses mahasiswa, proyek akhir, peminjaman terawasi",
    permissions: ["Proyek Akhir", "Peminjaman Terawasi", "Akses Penelitian"],
  },
];

const getRoleIcon = (role: string) => {
  switch (role) {
    case "ADMIN":
      return <Shield className="h-4 w-4" />;
    case "LABORAN":
      return <FlaskConical className="h-4 w-4" />;
    case "DOSEN":
      return <GraduationCap className="h-4 w-4" />;
    case "MAHASISWA":
      return <Users className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
  }
};

const getRoleColor = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-800 border-red-200";
    case "LABORAN":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "DOSEN":
      return "bg-green-100 text-green-800 border-green-200";
    case "MAHASISWA":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getIdLabel = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "PIN";
    case "LABORAN":
      return "NIP";
    case "DOSEN":
      return "NIDN";
    case "MAHASISWA":
      return "NIM";
    default:
      return "ID";
  }
};

interface LoginGuideProps {
  onQuickLogin?: (email: string, password: string) => void;
}

export default function LoginGuide({ onQuickLogin }: LoginGuideProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Tersalin!",
        description: `${type} telah disalin ke clipboard`,
      });
    } catch (error) {
      console.log("Error copying to clipboard:", error);

      toast({
        title: "Gagal menyalin",
        description: "Silakan salin secara manual",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = (email: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  const handleQuickLogin = (email: string, password: string) => {
    if (onQuickLogin) {
      onQuickLogin(email, password);
      toast({
        title: "Kredensial diisi",
        description: "Form login telah diisi dengan akun yang dipilih",
      });
    }
  };

  const groupedAccounts = {
    ADMIN: accounts.filter((acc) => acc.role === "ADMIN"),
    LABORAN: accounts.filter((acc) => acc.role === "LABORAN"),
    DOSEN: accounts.filter((acc) => acc.role === "DOSEN"),
    MAHASISWA: accounts.filter((acc) => acc.role === "MAHASISWA"),
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Akun Demo
          </CardTitle>
          <CardDescription>
            Gunakan akun demo ini untuk menguji berbagai peran pengguna.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full h-fit grid-cols-2 sm:grid-cols-5">
              <TabsTrigger value="all" className="border sm:border-none">
                Semua
              </TabsTrigger>
              <TabsTrigger value="ADMIN" className="border sm:border-none">
                Admin
              </TabsTrigger>
              <TabsTrigger value="LABORAN" className="border sm:border-none">
                Laboran
              </TabsTrigger>
              <TabsTrigger value="DOSEN" className="border sm:border-none">
                Dosen
              </TabsTrigger>
              <TabsTrigger
                value="MAHASISWA"
                className="col-span-2 justify-center border sm:border-none sm:col-span-1">
                Mahasiswa
              </TabsTrigger>{" "}
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {accounts.map((account) => (
                  <AccountCard
                    key={account.email}
                    account={account}
                    showPassword={showPasswords[account.email] || false}
                    onTogglePassword={() =>
                      togglePasswordVisibility(account.email)
                    }
                    onCopy={copyToClipboard}
                    onQuickLogin={handleQuickLogin}
                  />
                ))}
              </div>
            </TabsContent>

            {Object.entries(groupedAccounts).map(([role, roleAccounts]) => (
              <TabsContent key={role} value={role} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {roleAccounts.map((account) => (
                    <AccountCard
                      key={account.email}
                      account={account}
                      showPassword={showPasswords[account.email] || false}
                      onTogglePassword={() =>
                        togglePasswordVisibility(account.email)
                      }
                      onCopy={copyToClipboard}
                      onQuickLogin={handleQuickLogin}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface AccountCardProps {
  account: Account;
  showPassword: boolean;
  onTogglePassword: () => void;
  onCopy: (text: string, type: string) => void;
  onQuickLogin: (email: string, password: string) => void;
}

function AccountCard({
  account,
  showPassword,
  onTogglePassword,
  onCopy,
  onQuickLogin,
}: AccountCardProps) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{account.name}</CardTitle>
            <Badge
              className={`${getRoleColor(
                account.role
              )} flex items-center gap-1 w-fit`}>
              {getRoleIcon(account.role)}
              {account.role}
            </Badge>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div className="font-medium">{getIdLabel(account.role)}</div>
            <div className="font-mono">{account.id}</div>
          </div>
        </div>
        <CardDescription className="text-sm">
          {account.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <div className="font-mono text-sm">{account.email}</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(account.email, "Email")}>
              <Copy className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <div className="font-mono text-sm">
                {showPassword ? account.password : "••••••••••••"}
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" onClick={onTogglePassword}>
                {showPassword ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCopy(account.password, "Password")}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Akses</label>
          <div className="flex flex-wrap gap-1">
            {account.permissions.map((permission) => (
              <Badge key={permission} variant="secondary" className="text-xs">
                {permission}
              </Badge>
            ))}
          </div>
        </div>

        <Button
          onClick={() => onQuickLogin(account.email, account.password)}
          className="w-full"
          size="sm">
          <LogIn className="h-3 w-3 mr-2" />
          Quick Login
        </Button>
      </CardContent>
    </Card>
  );
}
