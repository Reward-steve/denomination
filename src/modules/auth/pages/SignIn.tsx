import { useForm } from "react-hook-form";
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { Button } from "../../../components/ui/Button";
import { useRegistration } from "../../../hooks/useRegistrationContext";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader } from "../../../components/ui/loader";
import { useAuth } from "../../../hooks/useAuth";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string; password: string }>();

  const { login, loading } = useAuth();

  const onSubmit = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    await login(username, password);
  };
  const { setStep } = useRegistration();

  useEffect(() => {
    setStep(0);
  }, [setStep]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} pageTitle="Sign In">
      <div>
        <FormInput
          id="username"
          label="Username"
          placeholder="A004"
          type="text"
          register={register("username", {
            required: "username is required",
          })}
          error={errors.username}
        />
      </div>

      <div>
        <FormInput
          id="password"
          label="Password"
          placeholder="********"
          type="password"
          register={register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          })}
          error={errors.password}
        />
      </div>
      <div className="flex w-full justify-start ">
        <Link to={"/auth/forgotten-password"} className="text-primary">
          Forgotten Password?
        </Link>
      </div>

      <Button type="submit" textSize="sm" variant="auth" disabled={loading}>
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      <p className="text-center">
        Don't have an account?{" "}
        <Link to={"/auth/email"} className="text-primary">
          Signup Here
        </Link>
      </p>
    </Form>
  );
}
