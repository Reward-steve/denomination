import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"
import DashboardLayout from "../../components/Layout";
import { DashboardHeader } from "../../components/Header";
import ListingSkeleton from "../Home/components/ListingSkeleton";
import img from "../../../../assets/images/avater.jpg";
import { fetchEventAttendance } from "../../services/events";
import moment from "moment/moment";

export function EventView() {
    const p = useParams();
    const loc = useLocation();
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState<any[]>([]);


    useEffect(() => {
        fetchEventAttendance(Number(p.eventId)).then((res) => {
            setAttendance(res.data);
            setLoading(false);
        }).catch((e) => {
            console.error(e);
            setLoading(false);
        });
    }, [loc])

    const formatDate = (date: string) => {
        const Odate = new Date(date);
        const momentString = Odate.getFullYear() === new Date().getFullYear() ? "MMM D, h:mmA" : 'L';
        return moment(date).format(momentString);
    }

    return <DashboardLayout>
        <DashboardHeader
            title={`Attendance`}
            description={loc.state?.event?.name || ''}
        >
            {attendance.length > 0 && <div className="text-text text-base text-start mb-[-1rem!important]">{attendance.length} Attendees found for this event</div>}
            <div className={`users-list w-full py-3 mt-4 flex bg-surface rounded-2xl flex-col ${(!loading && attendance.length > 0) ? 'items-end' : 'items-center'} gap-1 overflow-y-scroll max-h-[750px]`}>

                {loading && <ListingSkeleton items={4} className="w-full" borders={false} />}
                {!loading && attendance.length === 0 && <div className="text-text-secondary p-4">No attendance recorded yet.</div>}
                {!loading &&
                    attendance.map((user, idx) => {
                        return (
                            <div key={idx} className="w-full flex flex-col items-end">
                                <div

                                    className=" rounded-2xl p-3 w-full text-[0.8rem] px-3 sm:px-8 flex justify-between items-center"
                                >
                                    <div className="flex gap-2 items-center">
                                        <div className="w-12 h-12 overflow-hidden rounded">
                                            <img
                                                src={
                                                    user.photo
                                                        ? `${import.meta.env.VITE_BASE_URL.split("/api/")[0]
                                                        }/${user.photo}`
                                                        : img
                                                }
                                                alt={`${user.first_name} ${user.last_name}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-sm sm:text-base font-medium text-text">
                                                {`${user.username}`}
                                            </div>
                                            <div className="text-text-secondary/70">
                                                <span>marked by:</span> {user.marked_by}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-text text-end">{formatDate(user.created_at)}</div>
                                </div>
                                {attendance.length - 1 !== idx && <hr className="w-[calc(100%-68px)] sm:w-[calc(100%-92px)] border-border" />}
                            </div>
                        );
                    })}
            </div>
        </DashboardHeader>
    </DashboardLayout>
}