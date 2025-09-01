import { BsFillCheckCircleFill } from "react-icons/bs";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface iSuccessPageProps {
  title?: string;
  description?: string;
  className?: string;
  linkClass?: string;
  linkTo?: string;
  allowButtonIcon?: boolean;
  style?: Record<string, any>;
}

export default function Success({
  title = "Registration Complete!",
  description = "Your school profile has been created successfully. You can now begin managing your school operation",
  linkTo,
  linkClass,
  className,
  allowButtonIcon = true,
  style,
}: iSuccessPageProps) {
  return (
    <div
      className={`flex w-full min-h-screen items-center justify-center ${className}`}
      style={style}
    >
      <main className="h-[455px] max-w-md flex flex-col justify-evenly items-center  text-center px-4 border-1">
        <div
          style={{ boxShadow: "#00ff68 0px 0px 35px -3px" }}
          className="rounded-full flex  items-center justify-center"
        >
          <BsFillCheckCircleFill
            size={90}
            className="text-green-500 w-full h-full rounded-full"
          />
        </div>
        <header>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-light-secondary mb-6">{description}</p>
        </header>

        <Link
          to={linkTo ?? "/auth/signin"}
          className={`${linkClass} bg-primary text-white px-6 py-[14px] max-w-[400px] w-[100%] rounded-lg hover:bg-secondary transition flex justify-center items-center gap-4`}
        >
          Proceed {allowButtonIcon && <FaArrowRightLong />}
        </Link>
      </main>
    </div>
  );
}
