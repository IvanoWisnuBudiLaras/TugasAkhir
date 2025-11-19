export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign Up</h1>

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

          <div>
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2 mt-1 border rounded-lg"
              placeholder="•••••••"
            />
          </div>

          <button className="w-full bg-yellow-400 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/Login" className="text-yellow-600 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
