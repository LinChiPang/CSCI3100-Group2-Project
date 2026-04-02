import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCommunities, register } from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Community } from "../types/marketplace";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [communityId, setCommunityId] = useState<number | "">("");
  const [communities, setCommunities] = useState<Community[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    async function loadCommunities() {
      try {
        const res = await getCommunities();
        setCommunities(res);
        if (res.length > 0) setCommunityId(res[0].id);
      } catch {
        // Communities will remain empty; user can't submit without selecting one
      }
    }
    void loadCommunities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email.endsWith("@cuhk.edu.hk")) {
      setError("Please use your CUHK email (@cuhk.edu.hk)");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }
    if (communityId === "") {
      setError("Please select a community");
      return;
    }

    setLoading(true);
    try {
      const { user, token } = await register(email, password, passwordConfirmation, communityId);
      // Store token and user, then redirect to their community
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user", JSON.stringify(user));
      // Re-login through AuthContext so the state is updated
      await login(email, password);
      navigate(`/c/${communities.find((c) => c.id === communityId)?.slug ?? ""}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="mt-1 text-sm text-gray-500">Second-hand Marketplace · CUHK</p>
        </div>

        {/* CUHK notice */}
        <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
          Registration is restricted to CUHK students (@cuhk.edu.hk)
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              CUHK Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.name@cuhk.edu.hk"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
            />
          </div>

          {/* Password Confirmation */}
          <div>
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              required
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
            />
          </div>

          {/* Community */}
          <div>
            <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
              Community
            </label>
            {communities.length === 0 ? (
              <p className="text-sm text-gray-400 py-2">Loading communities...</p>
            ) : (
              <select
                id="community"
                required
                value={communityId}
                onChange={(e) => setCommunityId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm bg-white"
              >
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || communities.length === 0}
            className="w-full rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-400 transition-colors mt-2"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-gray-900 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
