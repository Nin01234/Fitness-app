"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { ErrorBoundary } from "@/components/error-boundary"

export function DatabaseConnectionTest() {
  const [status, setStatus] = useState("Testing connection...")
  const [tables, setTables] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      const supabase = createClient()
      try {
        // Test 1: Ping the database
        const { data: pingData, error: pingError } = await supabase.from('profiles').select('count(*)', { count: 'exact', head: true })
        
        if (pingError) {
          setStatus('Connection failed')
          setError(JSON.stringify(pingError, null, 2))
          return
        }
        
        // Test 2: List available tables
        const { data: tablesData, error: tablesError } = await supabase
          .from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public')
        
        if (tablesError) {
          setStatus('Connected but cannot list tables')
          setError(JSON.stringify(tablesError, null, 2))
          return
        }
        
        const tableNames = tablesData?.map(t => t.tablename) || []
        setTables(tableNames)
        
        setStatus('Connected successfully')
      } catch (e) {
        setStatus('Connection failed with exception')
        setError(e instanceof Error ? e.message : String(e))
      }
    }
    
    testConnection()
  }, [])

  return (
    <ErrorBoundary>
      <div className="p-4 max-w-xl mx-auto mt-10 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Database Connection Test</h2>
        
        <div className={`mb-4 p-3 rounded ${
          status.includes('failed') ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
          status.includes('Connected successfully') ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
        }`}>
          <p className="font-medium">Status: {status}</p>
        </div>
        
        {tables.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Available Tables:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {tables.map(table => (
                <li key={table}>{table}</li>
              ))}
            </ul>
          </div>
        )}
        
        {error && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-red-600 dark:text-red-400">Error:</h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto text-sm">{error}</pre>
          </div>
        )}
        
        <div className="mt-6 text-gray-600 dark:text-gray-400 text-sm">
          <p>Connection info:</p>
          <ul className="list-disc pl-5">
            <li>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Configured' : '✗ Missing'}</li>
            <li>API Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Configured' : '✗ Missing'}</li>
          </ul>
        </div>
      </div>
    </ErrorBoundary>
  )
} 