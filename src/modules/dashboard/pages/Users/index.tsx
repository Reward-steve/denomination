import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout";
import img from "../../../../assets/images/avater.jpg";
import { fetchUsers } from "./services";
import UserCardSkeleton from "./component/UserCardSkeleton";
import { useAuth } from "../../../../hooks/useAuth";
import { useDebounce } from "../../hook/useDebounce";
import FormInput from "../../../../components/ui/FormInput";
import { FaSearch, FaUsers } from "react-icons/fa";
import { Dropdown } from "../../../../components/ui/Dropdown";
import type { DropdownOption } from "../../../../types/auth.types";

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

interface FetchOptions {
  search: string;
  page: number;
  per_page: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // Dropdown filter value
  const [filter, setFilter] = useState<DropdownOption>({
    id: "all",
    name: "All Users",
  });

  const [options, setOptions] = useState<FetchOptions>({
    search: "",
    page: 1,
    per_page: 100,
  });
  const [searchValue, setSearchValue] = useState("");
  const delayed = useDebounce(searchValue, 1000);

  const { user } = useAuth();
  const is_admin = user?.is_admin || false;

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      search: delayed,
      page: 1,
    }));
  }, [delayed]);

  // Fetch users
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUser(true);
      try {
        const {
          data: { data },
        } = await fetchUsers(options);

        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    loadUsers();
  }, [options]);

  // Dropdown options
  const dropdownItems: DropdownOption[] = [
    ...(is_admin ? [{ id: "all", name: "All Users" }] : []),
    { id: "exco", name: "Executives" },
  ];

  // Filter users
  const filteredUsers =
    filter.id === "all" ? users : users.filter((u) => u.is_exco);

  return (
    <DashboardLayout>
      {/* Modern Header */}
      <header className="border-b border-border shadow-sm">
        <div className="flex flex-col gap-4 px-2 py-3">
          {/* Title & Subtitle */}
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-semibold text-text">
              User Directory
            </h1>
            <p className="text-sm text-text-placeholder">
              Manage and explore {is_admin ? "all users" : "executive members"}
            </p>
          </div>

          {/* Filter & Search Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Dropdown */}
            <div className="w-full sm:w-auto">
              <Dropdown
                label="Filter Users"
                items={dropdownItems}
                displayValueKey="name"
                value={filter}
                onSelect={(val) => setFilter(val!)}
                icon={FaUsers}
                size="big"
                placeholder="Select filter..."
                className="w-full sm:w-[220px] rounded-lg shadow-sm"
                optional
              />
            </div>

            {/* Search */}
            <div className="w-full sm:w-auto">
              <FormInput
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Search ${is_admin ? "users" : "excos"}...`}
                icon={FaSearch}
                label="Search Users"
                className="rounded-lg shadow-sm w-full sm:w-[280px]"
                parentClassName="w-full sm:w-auto"
                optional
              />
            </div>
          </div>
        </div>
      </header>

      {/* User List */}
      {loadingUser ? (
        <UserCardSkeleton />
      ) : (
        <section className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2">
          {filteredUsers.map((user) => (
            <article
              key={user.id}
              className="flex flex-col items-start gap-3 p-4 bg-surface text-text rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* User Image */}
              <div className="w-full h-[12rem] overflow-hidden rounded-lg">
                <img
                  src={
                    user.photo
                      ? `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}/${
                          user.photo
                        }`
                      : img
                  }
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* User Info */}
              <div className="flex flex-col items-start gap-1">
                <div className="font-medium">
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
      )}
    </DashboardLayout>
  );
}
