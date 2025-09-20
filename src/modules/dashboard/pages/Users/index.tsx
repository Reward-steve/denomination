import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout";
import { Button } from "../../../../components/ui/Button";
import { FaUserPlus, FaUserCircle } from "react-icons/fa";
import img from "../../../../assets/images/avater.jpg";
import { fetchUsers } from "./services";
import UserCardSkeleton from "./component/UserCardSkeleton";

interface iTab {
  all?: boolean;
  exco?: boolean;
  data: Array<Record<string, any>>;
}

//type for tab state, e.g all,ex

export default function Users() {
  const [users, setUsers] = useState<Array<Record<string, any>>>([]);
  const [loadingUser, setLoadingUser] = useState(true);

  const [tab, setTab] = useState<iTab>({
    "all": true, "exco": false, data: []
  });

  const [options, setOptions] = useState<any>({
    search: "", page: 1, per_page: 100
  });

  const handleTabClicking = (type: "all" | "exco" = "all") => {
    setTab({
      all: type === "all",
      exco: type === "exco",
      data: type === "all" ? users : users.filter((u) => u.is_exco)
    });
  };

  useEffect(() => {
    fetchUsers(options).then(({ data: { data } }) => {
      setTab({
        all: true,
        exco: false,
        data: data
      });
      setUsers(data);
    }).catch((e) => {
      console.log(e);

    }).finally(() => {
      setLoadingUser(false);
    })
  }, [])

  return (
    <DashboardLayout>

      <header className="flex flex-col border-b border-border sticky bg-background top-[56px] sm:top-[64px] sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex gap-6">
          <div className={`${tab?.all ? 'border-b-4' : ''} border-primary hover:bg-[#3b82f830]`}><Button variant="ghost" onClick={() => handleTabClicking('all')}>All</Button></div>
          <div className={`${tab?.exco ? 'border-b-4' : ''} border-primary hover:bg-[#3b82f830]`}><Button variant="ghost" onClick={() => handleTabClicking('exco')}>Executive</Button></div>
        </div>
      </header>


      {/* <section className="overflow-scroll "> h-[calc(100vh-250px)] sm:h-[calc(100vh-200px)]*/}
      {loadingUser && <UserCardSkeleton />}

      {!loadingUser && <div className="grid gap-3 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
        {tab.data.map((user) => (<div className="flex flex-col items-start gap-3 p-4 bg-surface text-text rounded-xl shadow-sm">
          <div className="w-full h-[12rem] overflow-hidden rounded">
            <img src={user.photo ? `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}/${user.photo}` : img} alt=" " className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <div>{`${user?.first_name} ${user?.middle_name || ''} ${user?.last_name}`}</div>
            <div className="text-gray-500">{user.is_exco ? user?.positions?.join(', ') : 'Member'}</div>
          </div>
        </div>))}
      </div>}

      {/* </section> */}
    </DashboardLayout>
  );
}
