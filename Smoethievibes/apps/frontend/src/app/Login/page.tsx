export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 mt-1 border rounded-lg"
              placeholder="youremail@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full p-2 mt-1 border rounded-lg"
              placeholder="•••••••"
            />
          </div>

          <button className="w-full bg-yellow-400 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <a href="/SignUp" className="text-yellow-600 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
