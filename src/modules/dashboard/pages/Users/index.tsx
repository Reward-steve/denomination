// src/features/dashboard/pages/Users.tsx
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/Layout";
import img from "../../../../assets/images/avater.jpg";
import { fetchUsers } from "./services";
import UserCardSkeleton from "./component/UserCardSkeleton";
import { useAuth } from "../../../../hooks/useAuth";
import { FaUsers } from "react-icons/fa";
import { Dropdown } from "../../../../components/ui/Dropdown";
import type { DropdownOption } from "../../../../types/auth.types";

/* ==============================
   🔹 Types
================================ */
interface User {
  id: string | number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  photo?: string;
  is_exco?: boolean;
  positions?: string[];
  priest_status: string; // e.g. "posted" or ""
}

interface FetchOptions {
  search: string;
  page: number;
  per_page: number;
}

/* ==============================
   🔹 Component
================================ */
export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);

  // Dropdown filter
  const [filter, setFilter] = useState<DropdownOption | null>(null);

  const [options] = useState<FetchOptions>({
    search: "",
    page: 1,
    per_page: 100,
  });

  const { user } = useAuth();
  const is_admin = Boolean(user?.is_admin);

  /* ==============================
     🔹 Fetch Users
  ================================= */
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

  /* ==============================
     🔹 Dropdown Items
  ================================= */
  const dropdownItems: DropdownOption[] = [
    ...(is_admin ? [{ id: "all", name: "All Users" }] : []),
    { id: "priest_status", name: "Posted Priests" },
    { id: "exco", name: "Executives" },
  ];

  // Set default filter based on role
  useEffect(() => {
    if (is_admin) {
      setFilter(dropdownItems[0]); // "All Users"
    } else {
      setFilter(dropdownItems.find((i) => i.id === "exco")!);
    }
  }, [is_admin]);

  /* ==============================
     🔹 Filtering Logic
  ================================= */
  const filteredUsers = useMemo(() => {
    if (!filter) return users;

    switch (filter.id) {
      case "all":
        return users;
      case "exco":
        return users.filter((u) => u.is_exco);
      case "priest_status":
        return users.filter((u) => u.priest_status === "posted");
      default:
        return users;
    }
  }, [users, filter]);

  /* ==============================
     🔹 Empty State Message
  ================================= */
  const getEmptyMessage = () => {
    if (!filter) return "No users found.";

    switch (filter.id) {
      case "all":
        return "No users found in the directory.";
      case "exco":
        return "No executive members available.";
      case "priest_status":
        return "No posted priests available.";
      default:
        return "No users match your selection.";
    }
  };

  /* ==============================
     🔹 Render
  ================================= */
  return (
    <DashboardLayout>
      {/* Header */}
      <header className="border-b border-border shadow-sm">
        <div className="flex flex-col gap-4 px-2 py-3">
          {/* Title */}
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-text">
              User Directory
            </h1>
            <p className="text-sm text-text-placeholder">
              Manage and explore {is_admin ? "all users" : "executive members"}
            </p>
          </div>

          {/* Dropdown Filter */}
          <div className="w-full sm:w-[220px]">
            <Dropdown
              label="Filter Users"
              items={dropdownItems}
              displayValueKey="name"
              value={filter ?? undefined}
              onSelect={(val) => val && setFilter(val)}
              icon={FaUsers}
              size="big"
              placeholder="Select filter..."
              className="w-full rounded-lg shadow-sm"
              optional
            />
          </div>
        </div>
      </header>

      {/* User List */}
      {loadingUser ? (
        <UserCardSkeleton />
      ) : filteredUsers.length === 0 ? (
        <div className="flex items-center justify-center h-60">
          <p className="text-text-placeholder text-sm">{getEmptyMessage()}</p>
        </div>
      ) : (
        <section className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-2">
          {filteredUsers.map((user) => (
            <article
              key={user.id}
              className="flex flex-col items-start gap-3 p-4 bg-surface text-text rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Image */}
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

              {/* Info */}
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
