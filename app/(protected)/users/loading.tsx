import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function UsersLoading() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 md:ml-64 p-4 sm:p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-2" />
              </CardHeader>
              <CardContent>
                <div className="h-6 w-1/2 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-2/3 bg-gray-100 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle className="h-4 w-1/4 bg-gray-300 rounded mb-2" />
            <CardDescription className="h-3 w-1/2 bg-gray-200 rounded" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-10 bg-gray-200 rounded w-full sm:w-1/2" />
              <div className="h-10 bg-gray-200 rounded w-full sm:w-40" />
              <div className="h-10 bg-gray-200 rounded w-full sm:w-40" />
            </div>
          </CardContent>
        </Card>

        {/* Tabel */}
        <Card className="animate-pulse">
          <CardHeader>
            <CardTitle className="h-4 w-1/4 bg-gray-300 rounded mb-2" />
            <CardDescription className="h-3 w-1/2 bg-gray-200 rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 items-center">
                  <div className="h-4 bg-gray-200 rounded col-span-1" />
                  <div className="h-4 bg-gray-100 rounded col-span-1" />
                  <div className="h-4 bg-gray-200 rounded col-span-1" />
                  <div className="h-4 bg-gray-100 rounded col-span-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
