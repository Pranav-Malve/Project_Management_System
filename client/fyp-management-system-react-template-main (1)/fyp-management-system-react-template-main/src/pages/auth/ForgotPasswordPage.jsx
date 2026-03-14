import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { KeyRound, Loader } from "lucide-react";
import { forgotPassword } from "../../store/slices/authSlice";

const ForgotPasswordPage = () => {

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const { isRequestingForToken } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return;
    }

    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setIsSubmitted(true);
    } catch (err) {
      setError(err || "Failed to send link. Please try again");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">

          <h1 className="text-2xl font-bold">Check Your Email</h1>

          <p className="mt-2">
            Reset link sent to <strong>{email}</strong>
          </p>

          <Link
            to="/login"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back to Login
          </Link>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

      <div className="max-w-md w-full">

        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl font-bold">Forgot Password</h1>

        </div>

        <div className="bg-white p-6 rounded shadow">

          <form onSubmit={handleSubmit}>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full border px-3 py-2 rounded"
              disabled={isRequestingForToken}
            />

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={isRequestingForToken}
              className="w-full bg-blue-500 text-white py-2 mt-4 rounded"
            >
              {isRequestingForToken ? (
                <Loader className="animate-spin mx-auto" />
              ) : (
                "Send Reset Link"
              )}
            </button>

          </form>

          <div className="mt-6 text-center">

            <p className="text-sm text-slate-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
              </Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ForgotPasswordPage;