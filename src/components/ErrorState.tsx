type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <h2 className="font-bold">Error loading advocates</h2>
        <p>{message}</p>
      </div>
    </main>
  );
}
