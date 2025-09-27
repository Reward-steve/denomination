// src/features/home/pages/Home.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui/Button";
import OutStanding from "./components/OutStanding";
import DashboardLayout from "../../components/Layout";
import { useResponsive } from "../../../../hooks/useResponsive";
import { useAuth } from "../../../../hooks/useAuth";

import {
  fetchAnnouncments,
  fetchDocs,
  fetchEvents,
  readAnnouncments,
} from "../../services/home";
import {
  formatDateTime,
  formatNum,
  handleDownload,
} from "../../../../utils/appHelpers";

import { MarkAttendance } from "./components/MarkAttendance";
import { PaymentModal, type User } from "../Finance/components/PaymentModal";
import DocumentSkeleton from "./components/DocumentSkeleton";
import { FaCalendar } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { useFetchDebts } from "../../hook/useFinance";

/* ---------------- Empty State ---------------- */
function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-border bg-surface p-8 space-y-4 animate-fade">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="text-sm text-text-placeholder max-w-sm">{description}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/* ---------------- Home Page ---------------- */
export default function Home() {
  const { user } = useAuth();
  const { isMobile } = useResponsive();

  const fullName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "Guest";

  /* ---------------- Modals ---------------- */
  const [openAttendanceModal, setOpenAttendanceModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  /* ---------------- Debts ---------------- */
  const { data: debtsRes } = useFetchDebts(user?.id || 0, !!user?.id);

  const debts = debtsRes?.data || [];
  const totalOutstanding = debts.reduce(
    (sum: number, d: any) => sum + (d.acculated_amount || 0),
    0
  );

  /* ---------------- Announcements ---------------- */
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [annIndex, setAnnIndex] = useState(0);
  const [anim, setAnim] = useState("slideInRight");

  const moveAnn = () => {
    if (announcements.length > 1) {
      setAnim("slideOutLeft");
      setTimeout(() => {
        setAnnIndex((i) => (i + 1) % announcements.length);
        setAnim("slideInRight");
      }, 300);
    }
  };

  const fetchAnn = () => {
    fetchAnnouncments()
      .then(({ data: { data } }) =>
        setAnnouncements(data.filter((d: any) => !d.read))
      )
      .catch(console.error);
  };

  const readAnn = (id: number) => {
    readAnnouncments(id).then(fetchAnn).catch(console.error);
  };

  useEffect(fetchAnn, []);
  useEffect(() => {
    if (announcements.length > 0) {
      const timer = setInterval(moveAnn, 30_000);
      return () => clearInterval(timer);
    }
  }, [announcements]);

  /* ---------------- Events + Docs ---------------- */
  const [ongoingEvents, setOngoingEvents] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState({ id: "", name: "" });

  useEffect(() => {
    fetchEvents()
      .then(({ data: { data } }) => setOngoingEvents(data))
      .catch(console.error);

    fetchEvents("upcoming")
      .then(({ data: { data } }) => setUpcomingEvents(data))
      .catch(console.error)
      .finally(() => setLoadingUpcoming(false));

    fetchDocs()
      .then(({ data: { data } }) => setDocs(data))
      .catch(console.error)
      .finally(() => setLoadingDocs(false));
  }, []);

  return (
    <DashboardLayout>
      {/* Attendance Modal */}
      {openAttendanceModal && (
        <MarkAttendance
          setOpenModal={setOpenAttendanceModal}
          data={selectedEvent}
        />
      )}

      {/* Payment Modal */}
      {openPaymentModal && (
        <PaymentModal
          onClose={() => setOpenPaymentModal(false)}
          user={user as User}
        />
      )}

      <div className="space-y-12">
        {/* ---------------- Intro ---------------- */}
        <section className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-secondary animate-fade">
            Welcome back, <span className="text-accent">{fullName}</span>
          </h1>
        </section>

        <div className="space-y-8">
          {/* ---------------- Announcements ---------------- */}
          {announcements.length > 0 && (
            <section className="space-y-3 overflow-hidden">
              <h2 className="text-xl font-semibold text-text">Announcements</h2>
              <div
                className={`animated ${anim} border border-border bg-surface rounded-2xl p-4`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-text mb-1">
                      {announcements[annIndex]?.title}
                    </div>
                    <p className="text-text-placeholder text-sm">
                      {announcements[annIndex]?.body}
                    </p>
                  </div>
                  {!isMobile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => readAnn(announcements[annIndex]?.id)}
                    >
                      Got it
                    </Button>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ---------------- Debts ---------------- */}
          {debts.length > 0 && (
            <section className="space-y-3">
              <div className="flex justify-between flex-col sm:flex-row gap-3">
                <h2 className="text-xl font-semibold text-text">Your Debts</h2>
                {user?.is_admin && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setOpenPaymentModal(true)}
                  >
                    Pay All (₦{formatNum(totalOutstanding)})
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {debts.map((d: any) => (
                  <OutStanding
                    key={d.item_id}
                    amount={`₦${formatNum(d.acculated_amount)}`}
                    fee={d.name}
                    times={`${d.periods_owed}x`}
                    onPayNow={() => setOpenPaymentModal(true)}
                    showPayNow={user?.is_admin}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ---------------- Ongoing Events ---------------- */}
          {ongoingEvents.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-text">
                Ongoing Events
              </h2>
              {ongoingEvents.map((ev, idx) => (
                <div
                  key={idx}
                  className="border border-border bg-surface rounded-2xl p-3"
                >
                  <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                    <div className="text-lg font-semibold text-text flex items-center">
                      {ev?.name}
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                        LIVE
                      </span>
                    </div>
                    {user?.is_admin && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(ev);
                          setOpenAttendanceModal(true);
                        }}
                      >
                        Take Attendance
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <EmptyState
              title="No Ongoing Events"
              description="There are no live events happening right now."
              icon={<FaCalendar size={28} />}
            />
          )}

          {/* ---------------- Upcoming Events + Documents ---------------- */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {/* Upcoming Events */}
            {loadingUpcoming ? (
              <DocumentSkeleton />
            ) : upcomingEvents.length > 0 ? (
              <div className="border border-border bg-surface rounded-2xl p-3 space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-text-placeholder">Next Events</h2>
                  <Link to="/dashboard/events" className="text-primary">
                    See all
                  </Link>
                </div>
                {upcomingEvents.slice(0, 3).map((ev, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center border-b border-border py-2"
                  >
                    <div>
                      <div className="text-lg text-text">{ev.name}</div>
                      <p className="text-sm text-text-placeholder">
                        {ev.venue}
                      </p>
                    </div>
                    <span className="text-sm text-text-placeholder">
                      {ev.date
                        ? formatDateTime(ev.date, ev.time)
                        : ev.day || ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Upcoming Events"
                description="Stay tuned! Upcoming events will appear here."
                icon={<FaCalendar size={28} />}
                action={
                  <Button variant="primary" size="sm">
                    <Link to="/dashboard/events">Create Event</Link>
                  </Button>
                }
              />
            )}

            {/* Documents */}
            {loadingDocs ? (
              <DocumentSkeleton />
            ) : docs.length > 0 ? (
              <div className="border border-border bg-surface rounded-2xl p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <h2 className="text-text-placeholder">Documents</h2>
                  <Link to="/dashboard/documents" className="text-primary">
                    See all
                  </Link>
                </div>
                {docs.slice(0, 3).map((doc, id) => (
                  <div
                    key={id}
                    className="flex justify-between items-center rounded-xl border border-border py-3 px-4"
                  >
                    <div>
                      <div className="text-lg text-text">{doc.name}</div>
                      <p className="text-sm text-text-placeholder">
                        {doc.descr || doc.type}
                      </p>
                    </div>
                    <Button
                      variant="gray"
                      size="sm"
                      onClick={() => handleDownload(doc.paths, doc.name)}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Documents Yet"
                description="You haven’t uploaded or received any documents."
                icon={<FaFileAlt size={28} />}
                action={
                  <Button variant="primary" size="sm">
                    <Link to="/dashboard/documents">Upload Document</Link>
                  </Button>
                }
              />
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
