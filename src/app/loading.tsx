export default function Loading() {
    return (
        <main className="min-h-screen p-4 pb-20 max-w-md mx-auto flex flex-col">
            <header className="pt-8 pb-6 flex items-start justify-between">
                <div>
                    <div className="h-9 w-48 bg-zinc-800 rounded-lg animate-pulse" />
                    <div className="h-4 w-32 bg-zinc-800/60 rounded mt-2 animate-pulse" />
                </div>
            </header>
            <div className="mt-4 mb-10 h-16 bg-zinc-800 rounded-2xl animate-pulse" />
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />
                ))}
            </div>
        </main>
    );
}
