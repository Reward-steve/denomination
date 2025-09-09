import { DashboardLayout } from "../../dashboard/components/Layout";
import { Button } from "../../../components/ui/Button";

export default function Home() {
  return (
    <DashboardLayout>
      <main className="p-6 space-y-8">
        {/* Welcome Message */}
        <section>
          <h1 className="text-3xl md:text-4xl font-bold text-text">
            Welcome Back
          </h1>
          <p className="text-text-placeholder mt-2">
            Here’s a quick overview of your account and activities.
          </p>
        </section>

        {/* Quick Stats / Cards */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-2xl bg-surface shadow">
            <h2 className="text-lg font-semibold">Applications</h2>
            <p className="mt-2 text-2xl font-bold text-primary">12</p>
            <p className="text-sm text-text-placeholder">Active this month</p>
          </div>

          <div className="p-6 rounded-2xl bg-surface shadow">
            <h2 className="text-lg font-semibold">Messages</h2>
            <p className="mt-2 text-2xl font-bold text-primary">4</p>
            <p className="text-sm text-text-placeholder">Unread</p>
          </div>

          <div className="p-6 rounded-2xl bg-surface shadow">
            <h2 className="text-lg font-semibold">Events</h2>
            <p className="mt-2 text-2xl font-bold text-primary">3</p>
            <p className="text-sm text-text-placeholder">This week</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary" size="lg">
              Start New Application
            </Button>
            <Button variant="secondary" size="lg">
              View Messages
            </Button>
            <Button variant="outline" size="lg">
              Upcoming Events
            </Button>
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
