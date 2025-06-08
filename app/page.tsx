export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="w-20 h-20 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 18V8l6 4.5V18h-12z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopify Notifications</h1>

        <p className="text-gray-600 mb-8">
          This is a React Native app built with Expo. To use the app, please follow the setup instructions below.
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Setup Instructions</h2>
          <ol className="text-left text-sm text-gray-600 space-y-2">
            <li>
              1. Install Expo CLI: <code className="bg-gray-200 px-2 py-1 rounded">npm install -g @expo/cli</code>
            </li>
            <li>2. Clone this repository</li>
            <li>
              3. Run <code className="bg-gray-200 px-2 py-1 rounded">npm install</code>
            </li>
            <li>
              4. Run <code className="bg-gray-200 px-2 py-1 rounded">expo start</code>
            </li>
            <li>5. Scan QR code with Expo Go app on your iOS device</li>
          </ol>
        </div>

        <div className="flex gap-4 justify-center">
          <a
            href="https://github.com/your-repo"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            View on GitHub
          </a>
          <a
            href="https://expo.dev"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Get Expo Go
          </a>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This web page is just for deployment purposes. The actual Shopify notification app
            runs natively on iOS devices through Expo Go.
          </p>
        </div>
      </div>
    </div>
  )
}
