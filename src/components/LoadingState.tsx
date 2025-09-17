export function LoadingState() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <div className="text-lg text-gray-600">Loading advocates...</div>
        </div>
      </div>
    </main>
  );
}
