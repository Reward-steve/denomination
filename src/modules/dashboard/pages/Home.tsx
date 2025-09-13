import { Button } from "../../../components/ui/Button";
import { FaEnvelope, FaCalendar } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import clsx from "clsx";
import { getFromStore } from "../../../utils/appHelpers";
import type { User } from "../../../types/auth.types";
import DashboardLayout from "../components/Layout";
import { Link } from "react-router-dom";

/* -------------------- TYPES -------------------- */
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

/* -------------------- COMPONENTS -------------------- */
const StatCard = ({ title, value, description, icon: Icon }: StatCardProps) => (
  <div
    className={clsx(
      "p-6 rounded-2xl bg-surface shadow-sm",
      "hover:shadow-md hover:bg-surface/60 transition-all duration-200 animate-fade border border-border"
    )}
  >
    <div className="flex items-start gap-4">
      <Icon className="text-2xl text-accent flex-shrink-0" />
      <div>
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        <p className="mt-1 text-2xl font-bold text-primary">{value}</p>
        <p className="mt-0.5 text-sm text-text-placeholder">{description}</p>
      </div>
    </div>
  </div>
);

/* -------------------- PAGE -------------------- */
export default function Home() {
  const user = getFromStore("curr_user") as User | null;

  // Gracefully handle missing user
  const fullName = user
    ? `${user.first_name} ${user.middle_name || ""} ${user.last_name}`.trim()
    : "Guest";

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* ---------------- Intro Section ---------------- */}
        <section className="space-y-2 my-4 sm:my-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text animate-fade">
            Welcome back, <span className="text-primary">{fullName}</span> 👋
          </h1>
          <p className="text-text-placeholder text-sm sm:text-base max-w-2xl">
            Here’s a quick overview of your account and activities. Stay on top
            of your applications, events, and messages with ease.
          </p>
        </section>

        <div className="border border-border bg-surface rounded-2xl p-6 sm:p-8 lg:p-12 max-w-5xl mx-auto space-y-8">
          {/* ---------------- Quick Stats ---------------- */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-text">Overview</h2>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Applications"
                value="12"
                description="Active this month"
                icon={FaFileAlt}
              />
              <StatCard
                title="Messages"
                value="4"
                description="Unread"
                icon={FaEnvelope}
              />
              <StatCard
                title="Events"
                value="3"
                description="This week"
                icon={FaCalendar}
              />
            </div>
          </section>
          {/* ---------------- Quick Actions ---------------- */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-text">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto animate-fade transition-all"
              >
                Start New Application
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto animate-fade transition-all"
              >
                View Messages
              </Button>
              <Link to={"/dashboard/events"} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto animate-fade transition-all"
                >
                  Upcoming Events
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
