import { Button } from "../../../../components/ui/Button";

import OutStanding from "../component/OutStanding";

import {
  formatDateTime,
  formatNum,
  handleDownload,
} from "../../../../utils/appHelpers";
import DashboardLayout from "../../components/Layout";
import { Link } from "react-router-dom";
import { useResponsive } from "../../../../hooks/useResponsive";

import { useEffect, useState } from "react";
import {
  fetchAnnouncments,
  fetchDocs,
  fetchEvents,
  readAnnouncments,
} from "../../services/home";

import { useAuth } from "../../../../hooks/useAuth";
import { MarkAttendance } from "../component/MarkAttendance";
import DocumentSkeleton from "../component/DocumentSkeleton";

export default function Home() {
  const { user } = useAuth();
  const { isMobile } = useResponsive();

  // Gracefully handle missing user
  const fullName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "Guest";

  const [openModal, setOpenModal] = useState(false);
  // const [selectEventID, setSelectEventID] = useState(0);
  const [announcements, setAnnouncments] = useState<any>([]);

  const [index, setIndex] = useState(0);
  const [anim, setAnim] = useState("slideInRight");
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [docs, setDocs] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [loadingDocs, SetLoadingDocs] = useState(true);
  // const [loadingOngoing, SetLoadingOngoing] = useState(true);
  const [loadingUpcoming, SetLoadingUpcoming] = useState(true);

  const move = () => {
    setAnim("slideOutLeft");
    setTimeout(() => {
      setIndex((i) => (i + 1) % announcements.length);
      setAnim("slideInRight");
    }, 300);
  };

  useEffect(() => {
    const timer = setInterval(move, 30_000); // 30sec
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
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(fetchAnn, []);

  useEffect(() => {
    //fetch ongoing events
    fetchEvents().then(({ data: { data } }) => {
      setOngoingEvents(data);
    });

    //fetch upcoming (Next) events
    fetchEvents("upcoming")
      .then(({ data: { data } }) => {
        setUpcomingEvents(data);
      })
      .catch(() => {})
      .finally(() => {
        SetLoadingUpcoming(false);
      });

    //fetch documents
    fetchDocs()
      .then(({ data: { data } }) => {
        setDocs(data);
      })
      .catch(() => {})
      .finally(() => {
        SetLoadingDocs(false);
      });
  }, []);

  return (
    <DashboardLayout>
      {openModal && (
        <MarkAttendance setOpenModal={setOpenModal} data={selectedEvent} />
      )}

      <div className="space-y-12">
        {/* ---------------- Intro Section ---------------- */}
        <section className="space-y-2 my-4 sm:my-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text animate-fade">
            Welcome back, <span className="text-primary">{fullName}</span> 👋
          </h1>
        </section>

        <div className="rounded-2xl p-3 sm:p-3 lg:p-3 max-w-5xl mx-auto space-y-8">
          {/* ---------------- Quick Stats ---------------- */}
          {Array.isArray(announcements) && announcements.length > 0 && (
            <section className="space-y-3 overflow-hidden">
              <h2 className="text-xl font-semibold text-text">Announcements</h2>

              <div
                className={`animated ${anim} border border-border bg-surface rounded-2xl p-3 sm:p-3 lg:p-3 max-w-5xl mx-auto space-y-8`}
              >
                <div className="flex items-end justify-between">
                  <div className="md:max-w-[80%] max-w-[100%]">
                    <div className="text-xl font-semibold text-text mb-1">
                      {announcements[index]?.title}
                    </div>
                    <p className="w-[100%] text-text-placeholder">
                      {announcements[index]?.body}
                    </p>
                  </div>
                  {!isMobile && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={() => readAnn(announcements[index]?.id)}
                    >
                      Got it
                    </Button>
                  )}
                </div>
              </div>
            </section>
          )}

          <section className="space-y-3">
            <div className="flex justify-between items-left flex-col sm:flex-row gap-[10px]">
              <h2 className="text-xl font-semibold text-text">Due payments</h2>
              <div className="w-full max-w-[150px] ">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full animate-fade transition-all"
                >
                  Pay All (N14,750){" "}
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

          {ongoingEvents?.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-text">
                Ongoing Events
              </h2>

              {ongoingEvents.map((ev: any) => (
                <div className="border border-border bg-surface rounded-2xl p-3 sm:p-3 lg:p-3 max-w-5xl mx-auto space-y-8">
                  <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
                    <div className="text-xl flex justify-center items-center font-semibold text-text mb-1">
                      {ev?.name}
                      <small className="text-[red] text-[12px] bg-[#ff00002a] px-[4px] rounded ml-[7px]">
                        LIVE
                      </small>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setSelectedEvent(ev);
                        setOpenModal(true);
                      }}
                    >
                      Take Attendance
                    </Button>
                  </div>
                </div>
              ))}
            </section>
          )}

          <section className="grid gap-4 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            {loadingUpcoming && <DocumentSkeleton />}
            {!loadingUpcoming && upcomingEvents.length > 0 && (
              <div className="border border-border bg-surface rounded-2xl p-3 sm:p-3 lg:p-3 space-y-3">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-text-placeholder">Next Events</h2>
                  <Link to={"/dashboard/events"} className="text-primary">
                    See all
                  </Link>
                </div>

                {
                  ((upcomingEvents.length = 3),
                  upcomingEvents.map(
                    ({ name, day, date, time, venue, month }: any, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b-2 border-border p-2"
                      >
                        <div>
                          <div className="text-[18px] text-text">{name}</div>
                          <p className="text-text-placeholder">{venue}</p>
                        </div>
                        <div className="text-text-placeholder">
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
                    )
                  ))
                }
              </div>
            )}

            {/* Documents */}
            {loadingDocs && <DocumentSkeleton />}
            {!loadingDocs && docs.length > 0 && (
              <div className="border border-border bg-surface rounded-2xl p-3 sm:p-3 lg:p-3 space-y-2">
                <div className="flex justify-between items-center w-full">
                  <h2 className="text-text-placeholder">Documents</h2>
                  <Link to={"/dashboard/events"} className="text-primary">
                    See all
                  </Link>
                </div>

                {
                  ((docs.length = 3),
                  docs.map(({ paths, name, descr, type }: any) => (
                    <div className="flex justify-between items-center rounded-xl border-2 border-border py-3 px-4">
                      <div>
                        <div className="text-[18px] text-text">{name}</div>
                        <p className="text-text-placeholder">
                          {!descr || descr?.length === 0 ? type : descr}
                        </p>
                      </div>
                      <Button
                        variant="gray"
                        size="sm"
                        onClick={() => handleDownload(paths, name)}
                      >
                        {" "}
                        Download{" "}
                      </Button>
                    </div>
                  )))
                }
              </div>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
