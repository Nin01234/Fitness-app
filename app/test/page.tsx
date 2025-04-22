import { DatabaseConnectionTest } from '@/app/database-test';
import { DynamicDataTest } from './dynamic-data-test';

export default function TestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Database Connection Test</h1>
      <DatabaseConnectionTest />
      <DynamicDataTest />
      
      <div className="mt-8 text-center">
        <p className="text-lg font-medium">Check these results to confirm your app is connected to Supabase</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          If you see errors, make sure you've applied all migrations and your environment variables are correct
        </p>
      </div>
    </div>
  );
} 