export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-bold">Lotus 1-2-3 Forge App</h1>
        <p className="text-lg text-muted-foreground">
          This is a Forge app for Atlassian Confluence that brings Lotus 1-2-3 spreadsheets to your pages.
        </p>
        <div className="space-y-2 text-left bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Quick Start</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Deploy with: <code className="bg-background px-2 py-1 rounded">forge deploy</code>
            </li>
            <li>
              Install with: <code className="bg-background px-2 py-1 rounded">forge install</code>
            </li>
            <li>
              Test locally: <code className="bg-background px-2 py-1 rounded">npm run dev</code>
            </li>
          </ul>
        </div>
        <p className="text-sm text-muted-foreground">
          Visit{" "}
          <a href="http://localhost:3000/lotus123" className="underline">
            localhost:3000/lotus123
          </a>{" "}
          to test locally
        </p>
      </div>
    </div>
  )
}
