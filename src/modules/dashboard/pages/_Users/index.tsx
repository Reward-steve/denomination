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
import { Dropper, Item } from "../../../../components/layout/Dropper";
import { toast } from "react-toastify";
import { DashboardHeader } from "../../components/Header";
import { MdGroupOff } from "react-icons/md";

/* ==============================
   🔹 Types
================================ */
interface FetchOptions {
  search: string;
  page: number;
  per_page: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);

  const menu_items: Record<string, any>[] = [
    { label: "Make admin", key: "make_admin" },
    { label: "Disable login", key: "disable_login" },
    { label: "Delete", key: "del" },
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

  useEffect(() => {
    if (is_admin) {
      setFilter(dropdownItems[0]);
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
     🔹 Empty State
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

  const handleItemSelect = (
    _key: string,
    { name, id }: { name: string; id: number | string }
  ) => {
    if (_key == "make_admin") {
      MakeAdmin(id).then(() => {
        toast.success(name + " is now an Admin");
      });
    }
  };

  /* ==============================
     🔹 Render
  ================================= */
  return (
    <DashboardLayout>
      <DashboardHeader
        title="Users"
        description={`Manage and explore ${
          is_admin ? "all users" : "executive members"
        }`}
      >
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
            className="w-full rounded-lg shadow-md"
            optional
          />
        </div>

        {/* User List */}
        {loadingUser ? (
          <UserCardSkeleton />
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-72 text-center space-y-2">
            <MdGroupOff className="text-5xl text-text-placeholder" />
            <p className="text-text-placeholder text-base font-medium">
              {getEmptyMessage()}
            </p>
          </div>
        ) : (
          <section className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-2">
            {filteredUsers.map((user, idx) => (
              <article
                key={idx}
                className={`relative flex flex-col bg-surface rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-border ${_styles}`}
              >
                {/* Actions */}
                <Dropper
                  className="absolute top-3 right-3 z-10"
                  trigger={
                    <Button className="p-2 rounded-full bg-surface shadow hover:bg-border">
                      <FaEllipsisV className="text-text-secondary" />
                    </Button>
                  }
                >
                  {menu_items.map(({ key, label }, idx) => (
                    <Item
                      key={idx}
                      onClick={() =>
                        handleItemSelect(key, {
                          name: `${user.first_name} ${user.last_name}`,
                          id: user.id,
                        })
                      }
                      className={`px-4 py-2 text-sm transition-colors rounded ${
                        key === "del"
                          ? "text-red-500 hover:bg-red-500"
                          : "hover:bg-background"
                      }`}
                    >
                      {label}
                    </Item>
                  ))}
                </Dropper>

                {/* Image */}
                <div className="w-full h-44 sm:h-52 overflow-hidden">
                  <img
                    src={
                      user.photo
                        ? `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}/${
                            user.photo
                          }`
                        : img
                    }
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="font-semibold text-lg text-text">
                    {`${user.first_name} ${user.middle_name || ""} ${
                      user.last_name
                    }`}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {user.is_exco ? user.positions?.join(", ") : "Member"}
                  </div>

                  {/* Grid Info */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                    {user.bethel && (
                      <div>
                        <span className="text-text-placeholder">Bethel: </span>
                        <span className="text-text">{user.bethel}</span>
                      </div>
                    )}
                    {user.zone && (
                      <div>
                        <span className="text-text-placeholder">Zone: </span>
                        <span className="text-text">{user.zone}</span>
                      </div>
                    )}
                    {user.area && (
                      <div>
                        <span className="text-text-placeholder">Area: </span>
                        <span className="text-text">{user.area}</span>
                      </div>
                    )}
                    {user.primary_phone && (
                      <div>
                        <span className="text-text-placeholder">Phone: </span>
                        <span className="text-text">{user.primary_phone}</span>
                      </div>
                    )}
                    {user.gender && (
                      <div>
                        <span className="text-text-placeholder">Gender: </span>
                        <span className="text-text capitalize">
                          {user.gender}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </DashboardHeader>
    </DashboardLayout>
  );
}
