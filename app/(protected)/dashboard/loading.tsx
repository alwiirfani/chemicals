import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex min-h-screen bg-gray-50 mt-16 sm:mt-0">
      <div className="flex-1 md:ml-64">
        <div className="p-6">
          <div className="mb-8">
            <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse mb-2" />
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded mb-2 w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-1" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-1/3 bg-gray-300 rounded mb-1" />
                <div className="h-3 w-1/2 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-4 w-4 bg-red-300 rounded" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="h-4 w-4 bg-yellow-300 rounded" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
