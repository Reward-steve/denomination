import { useEffect, useState } from "react";
import { FaCheck, FaUser } from "react-icons/fa6";

import FormInput from "../../../../../components/ui/FormInput";
import { Button } from "../../../../../components/ui/Button";
import ListingSkeleton from "./ListingSkeleton";

import img from "../../../../../assets/images/avater.jpg";
import { useDebounce } from "../../../hook/useDebounce";
import {
  fetchUsersForAttendance,
  markAttendance,
} from "../../../services/home";
import { BaseModal } from "../../../../../components/ui/BaseModal";

/* -------------------- Types -------------------- */
interface User {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  primary_phone: string;
  photo?: string;
  marked?: boolean;
}

interface MarkAttendanceProps {
  setOpenModal: (b:boolean) => void;
  data: { id: string; name: string };
}

interface MarkerState {
  [userId: string]: boolean;
}

/* -------------------- CTA Button -------------------- */
const Cta = ({
  status = false,
  onClick,
}: {
  status?: boolean;
  onClick: () => void;
}) => (
  <Button onClick={onClick} variant={status ? "gray" : "primary"} size="md">
    <div className="flex gap-2 justify-center items-center">
      {status && <FaCheck />}
      <span>{status ? "Marked" : "Mark"}</span>
    </div>
  </Button>
);

/* -------------------- Component -------------------- */
export function MarkAttendance({
  setOpenModal,
  data: { name, id },
}: MarkAttendanceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [marker, setMarker] = useState<MarkerState>({});
  const [loadingUser, setLoadingUser] = useState(true);

  const debouncedQuery = useDebounce(searchTerm);

  /* -------------------- Mark / Unmark Attendance -------------------- */
  const mark = async (uid: string, type: "mark" | "unmark" = "mark") => {
    const hasMarked = type === "mark";
    setMarker((prev) => ({ ...prev, [uid]: hasMarked }));

    try {
      await markAttendance(Number(id), { user_id: uid }, type);
    } catch (error) {
      console.error(error);
      // rollback optimistic update on failure
      setMarker((prev) => ({ ...prev, [uid]: !hasMarked }));
    }
  };

  /* -------------------- Fetch Users -------------------- */
  const fetchUsers = async (query: string) => {
    setLoadingUser(true);
    try {
      const {
        data: { data },
      } = await fetchUsersForAttendance(id, query);
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchUsers(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <BaseModal title="Mark Attendance" setClose={setOpenModal}>
      <div className="p-4 md:w-[700px] w-full flex flex-col items-center">
        <div className="text-text-secondary font-semibold text-lg mb-3">
          Take {name} Attendance
        </div>

        <FormInput
          autoFocus
          placeholder="Search user by name"
          type="search"
          icon={FaUser}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="users-list w-full py-3 mt-4 flex flex-col gap-3 overflow-y-scroll max-h-[750px]">
          {loadingUser && <ListingSkeleton items={4} />}

          {!loadingUser &&
            users.map((user) => {
              const hasMarked =
                marker[user.id] !== undefined ? marker[user.id] : user.marked;

              return (
                <div
                  key={user.id}
                  className="border border-border bg-surface rounded-2xl p-3 w-full flex justify-between items-center"
                >
                  <div className="flex gap-2 items-center">
                    <div className="w-12 h-12 overflow-hidden rounded">
                      <img
                        src={
                          user.photo
                            ? `${
                                import.meta.env.VITE_BASE_URL.split("/api/")[0]
                              }/${user.photo}`
                            : img
                        }
                        alt={`${user.first_name} ${user.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-base font-medium text-text">
                        {`${user.first_name} ${user.middle_name || ""} ${
                          user.last_name
                        }`}
                      </div>
                      <div className="text-sm text-text-secondary/70">
                        {user.primary_phone}
                      </div>
                    </div>
                  </div>

                  <Cta
                    status={hasMarked}
                    onClick={() => mark(user.id, hasMarked ? "unmark" : "mark")}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </BaseModal>
  );
}
