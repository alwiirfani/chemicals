"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Download,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Calendar,
  User,
  GraduationCap,
} from "lucide-react";
import { TopBorrower } from "@/types/reports";

interface MonthlyBorrowing {
  month: string;
  borrowings: number;
  returned: number;
}

interface BorrowingReportData {
  totalBorrowings: number;
  activeBorrowings: number;
  completedBorrowings: number;
  overdueBorrowings: number;
  rejectedBorrowings: number;
  averageReturnTime: number;
  monthlyBorrowings: MonthlyBorrowing[];
  topBorrowers: TopBorrower[];
  byUserType: {
    students: number;
    lecturers: number;
  };
}

interface BorrowingReportsProps {
  data: BorrowingReportData;
  period: string;
  onExport: () => void;
}

export function BorrowingReports({
  data,
  period,
  onExport,
}: BorrowingReportsProps) {
  const {
    totalBorrowings,
    activeBorrowings,
    completedBorrowings,
    overdueBorrowings,
    averageReturnTime,
    monthlyBorrowings,
    topBorrowers,
    byUserType,
  } = data;

  const completionRate =
    totalBorrowings > 0 ? (completedBorrowings / totalBorrowings) * 100 : 0;

  const overdueRate =
    activeBorrowings > 0 ? (overdueBorrowings / activeBorrowings) * 100 : 0;

  const studentPercentage =
    totalBorrowings > 0 ? (byUserType.students / totalBorrowings) * 100 : 0;

  const lecturerPercentage =
    totalBorrowings > 0 ? (byUserType.lecturers / totalBorrowings) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header dengan informasi periode */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Laporan Permintaan
          </h2>
          <div className="flex items-center mt-1 text-gray-600">
            <Calendar className="mr-2 h-4 w-4" />
            <p>Periode: {period}</p>
          </div>
        </div>
        <Button
          onClick={onExport}
          className="shrink-0 bg-green-700 hover:bg-green-400 text-white">
          <Download className="mr-2 h-4 w-4" />
          Export Laporan
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Permintaan
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBorrowings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeBorrowings} sedang aktif
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedBorrowings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(completionRate)}% tingkat penyelesaian
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terlambat</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {overdueBorrowings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(overdueRate)}% dari aktif
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Waktu
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageReturnTime}</div>
            <p className="text-xs text-muted-foreground">hari</p>
          </CardContent>
        </Card>
      </div>

      {/* User Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Jenis Pengguna</CardTitle>
          <CardDescription>
            Permintaan berdasarkan kategori pengguna pada periode {period}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {byUserType.students.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Mahasiswa</p>
              <p className="text-xs text-gray-500">
                {Math.round(studentPercentage)}% dari total
              </p>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex justify-center mb-2">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {byUserType.lecturers.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Dosen</p>
              <p className="text-xs text-gray-500">
                {Math.round(lecturerPercentage)}% dari total
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">
              Tingkat Penyelesaian
            </CardTitle>
            <CardDescription>
              Persentase permintaan yang berhasil diselesaikan pada periode{" "}
              {period}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="font-bold text-green-600">
                  {Math.round(completionRate)}%
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="text-sm text-gray-600">
                {completedBorrowings} dari {totalBorrowings} permintaan
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">
              Efisiensi Pengembalian
            </CardTitle>
            <CardDescription>
              Rata-rata waktu pengembalian bahan pada periode {period}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">
                {averageReturnTime}
              </div>
              <p className="text-sm text-gray-600">hari rata-rata</p>
              <div className="text-xs text-gray-500">
                Waktu ideal: ≤ 7 hari untuk permintaan reguler
              </div>
              <div className="mt-2">
                {averageReturnTime <= 7 ? (
                  <span className="text-xs text-green-600 font-medium">
                    ✔ Memenuhi target efisiensi
                  </span>
                ) : (
                  <span className="text-xs text-orange-600 font-medium">
                    ⚠ Perlu perbaikan proses pengembalian
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Borrowers */}
      <Card>
        <CardHeader>
          <CardTitle>Peminta Paling Aktif</CardTitle>
          <CardDescription>
            Top 5 pengguna dengan jumlah permintaan tertinggi pada periode{" "}
            {period}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topBorrowers.map((borrower, index) => (
              <div
                key={borrower.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {borrower.name}
                    </div>
                    {borrower.nim && (
                      <div className="text-sm text-gray-600">
                        NIM: {borrower.nim}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-600">
                    {borrower.count}
                  </div>
                  <div className="text-sm text-gray-600">Permintaan</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performa Bulanan</CardTitle>
          <CardDescription>
            Trend permintaan dan pengembalian per bulan pada periode {period}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Bulan</th>
                  <th className="text-right p-3 font-medium">Permintaan</th>
                  <th className="text-right p-3 font-medium">Pengembalian</th>
                  <th className="text-right p-3 font-medium">Tingkat</th>
                  <th className="text-right p-3 font-medium">Selisih</th>
                </tr>
              </thead>
              <tbody>
                {monthlyBorrowings.map((month, index) => {
                  const returnRate =
                    month.borrowings > 0
                      ? (month.returned / month.borrowings) * 100
                      : 0;
                  const difference = month.borrowings - month.returned;

                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{month.month}</td>
                      <td className="text-right p-3">{month.borrowings}</td>
                      <td className="text-right p-3">{month.returned}</td>
                      <td className="text-right p-3">
                        <span
                          className={`font-medium ${
                            returnRate >= 90
                              ? "text-green-600"
                              : returnRate >= 70
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}>
                          {Math.round(returnRate)}%
                        </span>
                      </td>
                      <td className="text-right p-3">
                        <span
                          className={`font-medium ${
                            difference === 0
                              ? "text-green-600"
                              : difference > 0
                              ? "text-red-600"
                              : "text-blue-600"
                          }`}>
                          {difference > 0 ? `+${difference}` : difference}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Rekomendasi untuk Periode {period}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-blue-700">
            • <span className="font-medium">Tindak lanjuti keterlambatan:</span>{" "}
            Follow up {overdueBorrowings} permintaan yang terlambat dengan
            reminder system
          </div>

          <div className="text-sm text-blue-700">
            • <span className="font-medium">Apresiasi performa:</span> Berikan
            recognition kepada top borrower ({topBorrowers[0]?.name}) dengan
            tingkat pengembalian tepat waktu
          </div>

          <div className="text-sm text-blue-700">
            • <span className="font-medium">Evaluasi kebijakan:</span> Review
            policy permintaan untuk mengurangi tingkat keterlambatan sebesar{" "}
            {Math.round(overdueRate)}%
          </div>

          <div className="text-sm text-blue-700">
            • <span className="font-medium">Optimalkan proses:</span>{" "}
            Pertimbangkan digital reminder untuk pengembalian yang lebih efisien
          </div>

          {averageReturnTime > 7 && (
            <div className="text-sm text-blue-700">
              •{" "}
              <span className="font-medium">Perbaikan waktu pengembalian:</span>{" "}
              Rata-rata pengembalian {averageReturnTime} hari melebihi target 7
              hari
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
