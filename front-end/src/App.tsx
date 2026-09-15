/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage("Error connecting to backend"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">Full Stack App</h1>
        <p className="text-gray-600">Frontend: React & TypeScript</p>
        <p className="text-gray-600">Backend: Python (FastAPI)</p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Backend Response</p>
          <p className="text-lg text-indigo-600 font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
}
