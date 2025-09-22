import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout";
import { Button } from "../../../../components/ui/Button";
import img from "../../../../assets/images/avater.jpg";
import { fetchUsers } from "./services";
import UserCardSkeleton from "./component/UserCardSkeleton";

// Types
interface User {
  id: string | number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  photo?: string;
  is_exco?: boolean;
  positions?: string[];
}

interface TabState {
  all: boolean;
  exco: boolean;
  data: User[];
}

interface FetchOptions {
  search: string;
  page: number;
  per_page: number;
}

export default function Users() {
  // States
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  const [tab, setTab] = useState<TabState>({
    all: true,
    exco: false,
    data: [],
  });

  const [options, setOptions] = useState<FetchOptions>({
    search: "",
    page: 1,
    per_page: 12,
  });

  // Handle tab switching
  const handleTabClicking = (type: "all" | "exco") => {
    setTab({
      all: type === "all",
      exco: type === "exco",
      data: type === "all" ? users : users.filter((u) => u.is_exco),
    });
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1, // reset to first page
    }));
  };

  // Handle pagination
  const handleNextPage = () => {
    setOptions((prev) => ({ ...prev, page: prev.page + 1 }));
  };

  const handlePrevPage = () => {
    setOptions((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  };

  // Fetch users on mount & when options change
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUser(true);
      try {
        const {
          data: { data },
        } = await fetchUsers(options);

        setUsers(data);
        setTab({
          all: true,
          exco: false,
          data,
        });
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUsers();
  }, [options]);

  return (
    <DashboardLayout>
      {/* Header with search & tabs */}
      <header className="flex flex-col border-b border-border sticky bg-background top-[56px] sm:top-[64px] gap-4 mb-4">
        <div className="flex items-center justify-between">
          {/* Tabs */}
          <div className="flex gap-6">
            <div
              className={`${
                tab.all ? "border-b-4" : ""
              } border-primary hover:bg-[#3b82f830]`}
            >
              <Button variant="ghost" onClick={() => handleTabClicking("all")}>
                All
              </Button>
            </div>
            <div
              className={`${
                tab.exco ? "border-b-4" : ""
              } border-primary hover:bg-[#3b82f830]`}
            >
              <Button variant="ghost" onClick={() => handleTabClicking("exco")}>
                Executive
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search users..."
            value={options.search}
            onChange={handleSearch}
            className="px-3 py-2 border rounded-md text-sm"
          />
        </div>
      </header>

      {/* User List */}
      {loadingUser ? (
        <UserCardSkeleton />
      ) : (
        <>
          <section className="grid gap-3 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {tab.data.map((user) => (
              <article
                key={user.id}
                className="flex flex-col items-start gap-3 p-4 bg-surface text-text rounded-xl shadow-sm"
              >
                {/* User Image */}
                <div className="w-full h-[12rem] overflow-hidden rounded">
                  <img
                    src={
                      user.photo
                        ? `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}/${
                            user.photo
                          }`
                        : img
                    }
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* User Info */}
                <div className="flex flex-col items-start gap-1">
                  <div>
                    {`${user.first_name} ${user.middle_name || ""} ${
                      user.last_name
                    }`}
                  </div>
                  <div className="text-text-placeholder text-sm">
                    {user.is_exco ? user.positions?.join(", ") : "Member"}
                  </div>
                </div>
              </article>
            ))}
          </section>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={handlePrevPage}
              disabled={options.page === 1}
            >
              Previous
            </Button>
            <span>Page {options.page}</span>
            <Button variant="outline" onClick={handleNextPage}>
              Next
            </Button>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
