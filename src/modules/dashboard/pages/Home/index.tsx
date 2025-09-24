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
import DocumentSkeleton from "./components/DocumentSkeleton";
import { FaCalendar, FaPhone } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";

// ---------------- Reusable EmptyState ----------------
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

// ---------------- Home Page ----------------
export default function Home() {
  const { user } = useAuth();
  const { isMobile } = useResponsive();

  const fullName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "Guest";

  const [openModal, setOpenModal] = useState(false);
  const [announcements, setAnnouncments] = useState<any>([]);
  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState("slideInRight");
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [docs, setDocs] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({ id: "", name: "" });
  const [loadingDocs, SetLoadingDocs] = useState(true);
  const [loadingUpcoming, SetLoadingUpcoming] = useState(true);

  // Animation cycle for announcements
  const move = () => {
    setAnim("slideOutLeft");
    setTimeout(() => {
      setIndex((i) => (i + 1) % announcements.length);
      setAnim("slideInRight");
    }, 300);
  };

  useEffect(() => {
    const timer = setInterval(move, 30_000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const readAnn = (aid: number) => {
    readAnnouncments(aid).then(() => {
      fetchAnn();
      move();
    });
  };

  const fetchAnn = () => {
    fetchAnnouncments()
      .then(({ data: { data } }) => {
        setAnnouncments(data.filter((d: any) => !d.read));
      })
      .catch(console.error);
  };

  useEffect(fetchAnn, []);

  useEffect(() => {
    fetchEvents().then(({ data: { data } }) => setOngoingEvents(data));

    fetchEvents("upcoming")
      .then(({ data: { data } }) => setUpcomingEvents(data))
      .catch(() => {})
      .finally(() => SetLoadingUpcoming(false));

    fetchDocs()
      .then(({ data: { data } }) => setDocs(data))
      .catch(() => {})
      .finally(() => SetLoadingDocs(false));
  }, []);

  return (
    <DashboardLayout>
      {openModal && (
        <MarkAttendance setOpenModal={setOpenModal} data={selectedEvent} />
      )}

      <div className="space-y-12">
        {/* ---------------- Intro Section ---------------- */}
        <section className="space-y-2 my-4 sm:my-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-secondary animate-fade">
            Welcome back, <span className="text-accent">{fullName}</span>
          </h1>
        </section>

        <div className="rounded-2xl max-w-5xl mx-auto space-y-8">
          {/* ---------------- Announcements ---------------- */}
          {announcements.length > 0 ? (
            <section className="space-y-3 overflow-hidden">
              <h2 className="text-xl font-semibold text-text">Announcements</h2>
              <div
                className={`animated ${anim} border border-border bg-surface rounded-2xl p-3 sm:p-3 lg:p-3 space-y-8`}
              >
                <div className="flex items-end justify-between">
                  <div className="md:max-w-[80%] max-w-full">
                    <div className="text-xl font-semibold text-text mb-1">
                      {announcements[index]?.title}
                    </div>
                    <p className="text-text-placeholder text-sm">
                      {announcements[index]?.body}
                    </p>
                  </div>
                  {!isMobile && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => readAnn(announcements[index]?.id)}
                    >
                      Got it
                    </Button>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <EmptyState
              title="No Announcements"
              description="You’re all caught up! No new announcements at the moment."
              icon={<FaPhone size={28} />}
            />
          )}

          {/* ---------------- Due Payments ---------------- */}
          <section className="space-y-3">
            <div className="flex justify-between items-left flex-col sm:flex-row gap-3">
              <h2 className="text-xl font-semibold text-text">Due payments</h2>
              <div className="w-full sm:max-w-[150px]">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  Pay All (N14,750)
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <OutStanding
                amount="N1,200"
                fee="Monthly dues"
                times="3x"
                onPayNow={() => console.log("paying...")}
              />
              <OutStanding
                amount="N1,200"
                fee="Year Registration fees"
                times="3x"
                onPayNow={() => console.log("paying...")}
              />
              <OutStanding
                amount="N1,200"
                fee="Monthly welfare payment"
                times="3x"
                onPayNow={() => console.log("paying...")}
              />
              <OutStanding
                amount="N1,200"
                fee="Group saving funds"
                times="3x"
                onPayNow={() => console.log("paying...")}
              />
            </div>
          </section>

          {/* ---------------- Ongoing Events ---------------- */}
          {ongoingEvents.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-text">
                Ongoing Events
              </h2>
              {ongoingEvents.map((ev: any, idx) => (
                <div
                  key={idx}
                  className="border border-border bg-surface rounded-2xl p-3 space-y-8"
                >
                  <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                    <div className="text-xl flex items-center font-semibold text-text">
                      {ev?.name}
                      <small className="text-red-600 text-xs bg-red-100 px-2 rounded ml-2">
                        LIVE
                      </small>
                    </div>
                    {user?.is_admin && <Button
                      variant="primary"
                      size="lg"
                      onClick={() => {
                        setSelectedEvent(ev);
                        setOpenModal(true);
                      }}
                    >
                      Take Attendance
                    </Button>}
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <EmptyState
              title="No Ongoing Events"
              description="There are no live events happening right now. Check back later!"
              icon={<FaCalendar size={28} />}
            />
          )}

          {/* ---------------- Upcoming Events & Documents ---------------- */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {/* Next Events */}
            {loadingUpcoming ? (
              <DocumentSkeleton />
            ) : upcomingEvents.length ? (
              <div className="border border-border bg-surface rounded-2xl p-3 space-y-3">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-text-placeholder">Next Events</h2>
                  <Link to="/dashboard/events" className="text-primary">
                    See all
                  </Link>
                </div>
                {upcomingEvents
                  .slice(0, 3)
                  .map(({ name, day, date, time, venue, month }: any, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center border-b border-border p-2"
                    >
                      <div>
                        <div className="text-lg text-text">{name}</div>
                        <p className="text-text-placeholder">{venue}</p>
                      </div>
                      <div className="text-sm text-text-placeholder">
                        {date
                          ? formatDateTime(date, time)
                          : day?.includes("5th")
                          ? "Last Sunday"
                          : isNaN(day)
                          ? day
                          : formatDateTime(
                              `2025-${formatNum(month)}-${formatNum(day)}`,
                              time
                            )}
                      </div>
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
                    <Link to="/dashboard/events/">Create Event</Link>
                  </Button>
                }
              />
            )}

            {/* Documents */}
            {loadingDocs ? (
              <DocumentSkeleton />
            ) : docs.length > 0 ? (
              <div className="border border-border bg-surface rounded-2xl p-3 space-y-2">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-text-placeholder">Documents</h2>
                  <Link to="/dashboard/documents" className="text-primary">
                    See all
                  </Link>
                </div>
                {docs
                  .slice(0, 3)
                  .map(({ paths, name, descr, type }: any, id) => (
                    <div
                      key={id}
                      className="flex justify-between items-center rounded-xl border border-border py-3 px-4"
                    >
                      <div>
                        <div className="text-lg text-text">{name}</div>
                        <p className="text-text-placeholder">
                          {!descr || descr?.length === 0 ? type : descr}
                        </p>
                      </div>
                      <Button
                        variant="gray"
                        size="sm"
                        onClick={() => handleDownload(paths, name)}
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
                    <Link to="/dashboard/documents/">Upload Document</Link>
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
