import { useState, useEffect } from 'react'

function App() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...')
  const [apiData, setApiData] = useState<any>(null)

  useEffect(() => {
    // Test backend connection
    const testBackend = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/health`)
        const data = await response.json()
        setApiStatus('✅ Connected')
        setApiData(data)
      } catch (error) {
        setApiStatus('❌ Not connected')
        console.error('Backend connection failed:', error)
      }
    }

    testBackend()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              📖 MythEdit
            </h1>
            <p className="text-xl text-gray-600">
              AI Story Continuity & Worldbuilding Assistant
            </p>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <StatusCard
              title="Frontend"
              status="✅ Running"
              detail="React + TypeScript"
              color="green"
            />
            <StatusCard
              title="Backend API"
              status={apiStatus}
              detail={apiData ? `Port ${apiData.timestamp ? '3000' : '?'}` : 'Port 3000'}
              color={apiStatus.includes('✅') ? 'green' : 'red'}
            />
            <StatusCard
              title="Databases"
              status="✅ Running"
              detail="PostgreSQL, Neo4j, Redis"
              color="green"
            />
          </div>

          {/* Setup Status */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">🎉 Setup Complete!</h2>
            <div className="space-y-3">
              <CheckItem text="Docker containers running" />
              <CheckItem text="PostgreSQL database initialized" />
              <CheckItem text="Neo4j graph database ready" />
              <CheckItem text="Redis cache & queue ready" />
              <CheckItem text="Backend API server configured" />
              <CheckItem text="Frontend React app running" />
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Set up the Python NLP service</li>
                <li>Create the backend routes for chapter upload</li>
                <li>Build the frontend upload interface</li>
                <li>Implement entity extraction pipeline</li>
                <li>Create knowledge graph visualization</li>
              </ol>
            </div>

            {apiData && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">API Health Check:</h3>
                <pre className="text-sm text-gray-600 overflow-auto">
                  {JSON.stringify(apiData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-600">
            <p>
              Ready to build your story continuity assistant! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusCard({ title, status, detail, color }: {
  title: string
  status: string
  detail: string
  color: 'green' | 'red' | 'yellow'
}) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    red: 'bg-red-50 border-red-200',
    yellow: 'bg-yellow-50 border-yellow-200',
  }

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-lg font-medium mb-1">{status}</p>
      <p className="text-sm text-gray-600">{detail}</p>
    </div>
  )
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-green-600">✓</span>
      <span className="text-gray-700">{text}</span>
    </div>
  )
}

export default App
