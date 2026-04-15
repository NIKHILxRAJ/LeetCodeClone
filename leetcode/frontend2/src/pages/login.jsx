import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {loginUser} from "../authslice";
// import { registerUser } from "../redux/authSlice"; // make sure this exists

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password should contain atleast 8 character"),
});

const Login = () => {
  // ✅ hooks INSIDE component
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-8">
        <h2 className="text-center text-3xl font-bold mb-6 text-primary italic">
          Leetcode
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <input
              type="email"
              placeholder="Email ID"
              className={`input input-bordered ${
                errors.emailId && "input-error"
              }`}
              {...register("emailId")}
            />
            {errors.emailId && (
              <span className="text-error text-xs mt-1">
                {errors.emailId.message}
              </span>
            )}
          </div>

          <div className="form-control">
            <input
              type="password"
              placeholder="Password"
              className={`input input-bordered ${
                errors.password && "input-error"
              }`}
              {...register("password")}
            />
            {errors.password && (
              <span className="text-error text-xs mt-1">
                {errors.password.message}
              </span>
            )}
          </div>

        <div className="form-control mt-8 flex justify-center">
  <button
    type="submit"
    className={`btn btn-primary btn-block ${loading ? "loading" : ""}`}
    disabled={loading}
  >
    {loading ? "Logging In..." : "Login"}
  </button>
</div>


          <p className="text-center text-sm mt-2">
           New user{" "}
            <Link to="/signup" className="link link-primary">
              signup
            </Link>
          </p>

          {error && (
            <p className="text-error text-sm text-center">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
