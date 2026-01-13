function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          MythEdit - AI Developmental Editor
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          If you can see this styled text, Tailwind CSS is working! ✅
        </p>
        <div className="bg-blue-100 border border-blue-500 rounded p-4">
          <p className="text-blue-800">
            Backend: http://localhost:3000
          </p>
          <p className="text-blue-800">
            Frontend: http://localhost:5174
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
