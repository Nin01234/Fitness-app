"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function DynamicDataTest() {
  const [dataStatus, setDataStatus] = useState<{
    [key: string]: { status: string; count: number; error: string | null }
  }>({
    testimonials: { status: "loading", count: 0, error: null },
    features: { status: "loading", count: 0, error: null },
    pricing_plans: { status: "loading", count: 0, error: null },
    profiles: { status: "loading", count: 0, error: null },
    workouts: { status: "loading", count: 0, error: null },
    meals: { status: "loading", count: 0, error: null },
    progress: { status: "loading", count: 0, error: null },
    achievements: { status: "loading", count: 0, error: null },
  })

  useEffect(() => {
    async function checkTables() {
      const supabase = createClient()
      const tables = Object.keys(dataStatus)
      
      for (const table of tables) {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })
          
          setDataStatus(prev => ({
            ...prev,
            [table]: {
              status: error ? "error" : "success",
              count: count || 0,
              error: error ? JSON.stringify(error) : null
            }
          }))
        } catch (e) {
          setDataStatus(prev => ({
            ...prev,
            [table]: {
              status: "error",
              count: 0,
              error: e instanceof Error ? e.message : String(e)
            }
          }))
        }
      }
    }
    
    checkTables()
  }, [])

  return (
    <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Dynamic Data Test</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Table</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Records</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Error</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {Object.entries(dataStatus).map(([table, data]) => (
              <tr key={table}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{table}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    data.status === "loading" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" :
                    data.status === "success" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }`}>
                    {data.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{data.count}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 max-w-xs truncate">
                  {data.error ? (
                    <span title={data.error} className="cursor-help">{data.error.substring(0, 50)}{data.error.length > 50 ? '...' : ''}</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded">
        <h3 className="font-semibold mb-2">Interpreting Results:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Success status means the table exists and is accessible</li>
          <li>The count shows how many records are in each table</li>
          <li>If some tables show 0 records, you may need to add data</li>
          <li>Error status means there's an issue with that table (hover over error for details)</li>
        </ul>
      </div>
    </div>
  )
} 