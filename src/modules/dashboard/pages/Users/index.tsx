// src/features/dashboard/pages/Users.tsx
import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/Layout";
import img from "../../../../assets/images/avater.jpg";
import { fetchUsers, MakeAdmin } from "./services";
import UserCardSkeleton from "./component/UserCardSkeleton";
import { useAuth } from "../../../../hooks/useAuth";
import { FaEllipsisV, FaUsers } from "react-icons/fa";
import { Dropdown } from "../../../../components/ui/Dropdown";
import type { DropdownOption, User } from "../../../../types/auth.types";
import { css } from "@emotion/css";
import { Button } from "../../../../components/ui/Button";
import { FaEllipsis } from "react-icons/fa6";
import { Dropper, Item } from "../../../../components/layout/Dropper";
import { toast } from "react-toastify";

/* ==============================
   🔹 Types
================================ */
// interface User {
//   id: string | number;
//   first_name: string;
//   middle_name?: string;
//   last_name: string;
//   photo?: string;
//   is_exco?: boolean;
//   positions?: string[];
//   priest_status: string; // e.g. "posted" or ""
// }

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
  const [closeDroper, setCloseDroper] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const menu_items: Record<string, any>[] = [
    { label: "Make admin", key: "make_admin" },
    { label: "Disable login", key: "disable_login" },
    { label: "Delete", key: "del" }
  ];

  // Dropdown filter
  const [filter, setFilter] = useState<DropdownOption | null>(null);

  const [options] = useState<FetchOptions>({
    search: "",
    page: 1,
    per_page: 100,
  });

  const { user } = useAuth();
  const is_admin = Boolean(user?.is_admin);
  const _styles = css({
    ["@media (max-width: 470px)"]: {
      flexDirection: "column",
    },
  });

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

  const handleItemSelect = (_key: string, { name, id }: { name: string, id: number | string }) => {
    if (_key == "make_admin") {
      MakeAdmin(id).then(() => {
        toast.success(name + ' is now an Admin');
      })
    }
  }

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
        <section className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 p-2">
          {filteredUsers.map((user, idx) => (
            <article
              key={idx}
              className={`flex items-start gap-3 relative p-4 bg-surface text-text rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 ${_styles}`}>
              <Dropper className="absolute top-1 right-1 z-10" trigger={
                <Button className="py-3 px-[12px] bg-surface text-text">
                  <FaEllipsisV className="text-text" />
                </Button>
              }>
                {
                  menu_items.map(({ key, label }, idx) =>
                    <Item key={idx} onClick={() =>
                      handleItemSelect(key, {
                        name: `${user.first_name} ${user.last_name}`,
                        id: user.id
                      })} className={`${key === "del" ? 'flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-500 hover:text-white transition-colors' : ''}`}>
                      {label}
                    </Item>)
                }

              </Dropper>

              {/* Image */}
              <div className="w-full h-[12rem] overflow-hidden rounded-lg">
                <img
                  src={
                    user.photo
                      ? `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}/${user.photo
                      }`
                      : img
                  }
                  alt={`${user.first_name} ${user.last_name}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col sm:w-[500px] w-full items-start gap-1">
                <div className="font-medium text-[1.2rem]">
                  {`${user.first_name} ${user.middle_name || ""} ${user.last_name}`}
                </div>

                <div className="">
                  <span className="text-text-placeholder text-sm">Bethel: </span>
                  <span className="text-text">{user.bethel}</span>
                </div>
                <div className="">
                  <span className="text-text-placeholder text-sm">Zone: </span>
                  <span className="text-text">{user.zone}</span>
                </div>
                <div className="">
                  <span className="text-text-placeholder text-sm">Area: </span>
                  <span className="text-text">{user.area}</span>
                </div>
                <div className="">
                  <span className="text-text-placeholder text-sm">Phone: </span>
                  <span className="text-text">{user.primary_phone}</span>
                </div>

                <div className="">
                  <span className="text-text-placeholder text-sm">Gender: </span>
                  <span className="text-text">{user.gender[0].toUpperCase() + user.gender.slice(1)}</span>
                </div>

                <div className="text-text-placeholder text-sm">
                  {user.is_exco && user.positions?.join(", ")}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </DashboardLayout>
  );
}
