/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Server, Database, Wifi } from 'lucide-react';

const APIConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    backend: { status: 'testing', message: 'Testing...', details: null },
    database: { status: 'testing', message: 'Testing...', details: null },
    endpoints: { status: 'testing', message: 'Testing...', details: [] }
  });

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    // Test backend health
    try {
      const healthResponse = await fetch('http://localhost:5000/health');
      const healthData = await healthResponse.json();
      
      if (healthResponse.ok) {
        setConnectionStatus(prev => ({
          ...prev,
          backend: {
            status: 'success',
            message: 'Backend connected successfully',
            details: healthData
          }
        }));
      }
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        backend: {
          status: 'error',
          message: 'Backend connection failed',
          details: error.message
        }
      }));
    }

    // Test API endpoints
    const endpoints = [
      { name: 'Cricket Teams', url: 'http://localhost:5000/api/cricket/teams' },
      { name: 'Sports Overview', url: 'http://localhost:5000/api/sports-overview/dashboard' },
      { name: 'SuperAdmin', url: 'http://localhost:5000/api/superadmin' }
    ];

    const endpointResults = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint.url);
        endpointResults.push({
          name: endpoint.name,
          status: response.ok ? 'success' : response.status === 401 ? 'auth-required' : 'error',
          statusCode: response.status,
          message: response.ok ? 'OK' : response.status === 401 ? 'Authentication Required' : `Error ${response.status}`
        });
      } catch (error) {
        endpointResults.push({
          name: endpoint.name,
          status: 'error',
          statusCode: null,
          message: error.message
        });
      }
    }

    setConnectionStatus(prev => ({
      ...prev,
      endpoints: {
        status: endpointResults.every(e => e.status === 'success' || e.status === 'auth-required') ? 'success' : 'partial',
        message: 'Endpoints tested',
        details: endpointResults
      }
    }));

    // Test database (indirectly through API)
    try {
      const dashboardResponse = await fetch('http://localhost:5000/api/sports-overview/dashboard');
      const dashboardData = await dashboardResponse.json();
      
      if (dashboardResponse.ok) {
        setConnectionStatus(prev => ({
          ...prev,
          database: {
            status: 'success',
            message: 'Database connected (via API)',
            details: dashboardData.data?.overview
          }
        }));
      }
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        database: {
          status: 'error',
          message: 'Database connection test failed',
          details: error.message
        }
      }));
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'auth-required':
        return <CheckCircle className="w-5 h-5 text-yellow-500" />;
      case 'partial':
        return <CheckCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
  };

  const StatusCard = ({ title, icon: Icon, status, onRetry }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <StatusIcon status={status.status} />
      </div>
      
      <p className={`text-sm mb-3 ${
        status.status === 'success' ? 'text-green-600' :
        status.status === 'error' ? 'text-red-600' :
        status.status === 'auth-required' || status.status === 'partial' ? 'text-yellow-600' :
        'text-gray-600'
      }`}>
        {status.message}
      </p>

      {status.details && (
        <details className="mt-3">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            View Details
          </summary>
          <pre className="p-3 mt-2 overflow-auto text-xs rounded bg-gray-50 max-h-32">
            {typeof status.details === 'string' ? status.details : JSON.stringify(status.details, null, 2)}
          </pre>
        </details>
      )}

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 mt-3 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
        >
          Retry Test
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-800">API Connection Test</h1>
          <p className="text-gray-600">Testing frontend-backend connectivity for Cricket Management System</p>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <StatusCard
            title="Backend Server"
            icon={Server}
            status={connectionStatus.backend}
            onRetry={testConnections}
          />

          <StatusCard
            title="Database"
            icon={Database}
            status={connectionStatus.database}
          />

          <StatusCard
            title="API Endpoints"
            icon={Wifi}
            status={connectionStatus.endpoints}
          />
        </div>

        {/* Endpoint Details */}
        {connectionStatus.endpoints.details.length > 0 && (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-lg font-semibold">Endpoint Test Results</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">Endpoint</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Code</th>
                    <th className="px-4 py-2 text-left">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {connectionStatus.endpoints.details.map((endpoint, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2 font-medium">{endpoint.name}</td>
                      <td className="px-4 py-2">
                        <StatusIcon status={endpoint.status} />
                      </td>
                      <td className="px-4 py-2">
                        {endpoint.statusCode && (
                          <span className={`px-2 py-1 rounded text-xs ${
                            endpoint.statusCode < 300 ? 'bg-green-100 text-green-800' :
                            endpoint.statusCode < 500 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {endpoint.statusCode}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">{endpoint.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Connection Summary */}
        <div className="p-6 mt-8 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-semibold">Connection Summary</h3>
          <div className="space-y-2">
            <p><strong>Frontend:</strong> Running on http://localhost:5174</p>
            <p><strong>Backend:</strong> {connectionStatus.backend.status === 'success' ? '✅ Connected to http://localhost:5000' : '❌ Not connected'}</p>
            <p><strong>Database:</strong> {connectionStatus.database.status === 'success' ? '✅ Connected via API' : '❌ Not connected'}</p>
            <p><strong>API Status:</strong> {connectionStatus.endpoints.status === 'success' ? '✅ All endpoints working' : '⚠️ Some issues detected'}</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="p-6 mt-8 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="mb-4 text-lg font-semibold text-blue-800">Next Steps</h3>
          <ul className="space-y-2 text-blue-700 list-disc list-inside">
            <li>If all connections are successful, you can proceed to use the application</li>
            <li>Visit <a href="/superadmin/login" className="underline hover:text-blue-800">/superadmin/login</a> to access the SuperAdmin panel</li>
            <li>Visit <a href="/cricket-management" className="underline hover:text-blue-800">/cricket-management</a> to manage cricket teams</li>
            <li>Check browser console for additional debugging information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default APIConnectionTest;
