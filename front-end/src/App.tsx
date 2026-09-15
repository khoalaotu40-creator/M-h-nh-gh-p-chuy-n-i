/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState<string>("Loading...");
  const [filePath, setFilePath] = useState("");
  const [divider, setDivider] = useState("");
  const [processResult, setProcessResult] = useState<any>(null);

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error connecting to backend"));
  }, []);

  const handleProcess = async () => {
    // Thiếu validate dữ liệu đầu vào (ví dụ: divider có phải là số không, có rỗng không)
    const res = await fetch("/api/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file_path: filePath, divider: parseInt(divider) }),
    });
    
    // Thiếu xử lý HTTP error (không check res.ok)
    const data = await res.json();
    setProcessResult(data);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-gray-900 flex flex-col items-center space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">Full Stack App</h1>
        <p className="text-gray-600">Frontend: React & TypeScript</p>
        <p className="text-gray-600">Backend: Python (FastAPI)</p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Backend Response</p>
          <p className="text-lg text-indigo-600 font-medium">{message}</p>
        </div>
      </div>

      {/* NEW FEATURE FORM */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full space-y-4">
        <h2 className="text-xl font-semibold">Data Processor</h2>
        <p className="text-sm text-gray-500">Test tính năng để AI Review bắt lỗi.</p>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">File Path (Path Traversal Risk)</label>
          <input 
            type="text" 
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="/etc/passwd or README.md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Divider (Division by Zero Risk)</label>
          <input 
            type="number" 
            value={divider}
            onChange={(e) => setDivider(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-indigo-500 focus:border-indigo-500" 
            placeholder="Enter a number (try 0)"
          />
        </div>

        <button 
          onClick={handleProcess}
          className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Process Data
        </button>

        {processResult && (
          <div className="mt-4 p-4 bg-gray-900 text-green-400 rounded-lg overflow-auto text-xs font-mono">
            <pre>{JSON.stringify(processResult, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
