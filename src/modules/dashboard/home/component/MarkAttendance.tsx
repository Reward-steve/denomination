import { FaCheck, FaUser } from "react-icons/fa6";
import FormInput from "../../../../../components/ui/FormInput";
import { Modal } from "../../../components/Modal";
import { useCallback, useEffect, useState } from "react";
import img from "../../../../../assets/images/avater.jpg";
import { Button } from "../../../../../components/ui/Button";
import { useDebounce } from "../../../hook/useDebounce";
import { fetchUsersForAttendance, markAttendance } from "../services/home";
import ListingSkeleton from "./ListingSkeleton";


const Cta = ({ status = false, onClick = () => void (0) }: any) => (
    <Button onClick={onClick} variant={status ? "gray" : "primary"} size="md">
        <div className="flex gap-2 justify-center items-center">
            {status && <FaCheck />}
            <span>{status ? "Marked" : "Mark"}</span>
        </div>
    </Button>
);

export function MarkAttendance({ setOpenModal, data: { name, id } }: any) {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    const debouncedQuery = useDebounce(searchTerm);
    const [marker, setMarker] = useState<Record<string, any>>();
    const [loadingUser, SetLoadingUser] = useState(true);


    const mark = (uid: string, type = 'mark') => {
        const hasMarked = type === 'mark';
        setMarker({ ...marker, [uid]: hasMarked });

        markAttendance(id, { user_id: uid }, type).then(({ data: { data } }) => {
            // console.log(data);
        }).catch((e) => {
            console.log(e);

        })
    }

    const fetchUsers = (query: string) => {
        SetLoadingUser(true);
        fetchUsersForAttendance(id, query).then(({ data: { data } }) => {
            setUsers(data);
        }).catch((e) => {
            console.log(e);
        }).finally(() => {
            SetLoadingUser(false);
        })
    }

    useEffect(() => {
        fetchUsers(debouncedQuery)
    }, [debouncedQuery]);



    return <>

        <Modal title={"Mark Attendance"} setClose={setOpenModal}>
            <div className="p-4 md:w-[700px] w-full flex flex-col items-center">
                <div className="text-text-secondary font-semibold text-[18px] mb-3">
                    Take {name} Attendance
                </div>
                <FormInput
                    autoFocus
                    placeholder="Search user by name"
                    type="search"
                    icon={FaUser}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="users-list w-full py-3 mt-4 flex-col flex gap-3 overflow-y-scroll max-h-[750px]">    {loadingUser && <ListingSkeleton items={4} />}
                    {!loadingUser && users.map((user: any, idx) => {
                        const hasMarked = marker?.[user.id] === undefined ? user.marked : marker?.[user.id];
                        return (<div key={idx} className="border border-border bg-surface rounded-2xl p-3 w-full flex justify-between items-center">
                            <div className="flex gap-2 items-center">
                                <div className="w-[3rem] h-[3rem] overflow-hidden rounded">
                                    <img
                                        src={user.photo ? `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}/${user.photo}` : img}
                                        alt=" "
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="text-xl font-semibold text-gray-800">
                                        {`${user.first_name} ${user.middle_name} ${user.last_name}`}
                                    </div>
                                    <div>{user.primary_phone}</div>
                                </div>
                            </div>
                            <Cta status={hasMarked} onClick={() => mark(user.id, hasMarked ? 'unmark' : 'mark')} />
                        </div>)
                    })
                    }
                </div>
            </div>
        </Modal>
    </>
}