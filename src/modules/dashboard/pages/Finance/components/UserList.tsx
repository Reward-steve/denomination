import { FaMoneyBillWave } from "react-icons/fa";
import { Button } from "../../../../../components/ui/Button";
import FormInput from "../../../../../components/ui/FormInput";
import ListingSkeleton from "../../Home/components/ListingSkeleton";
import avatar from "../../../../../assets/images/avater.jpg";

/* -------------------- Types -------------------- */
interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  primary_phone: string;
  photo?: string;
}

/* -------------------- User List -------------------- */
export function UserList({
  search,
  setSearch,
  users,
  loadingUser,
  onSelectUser,
  onClose,
}: {
  search: string;
  setSearch: (value: string) => void;
  users: User[];
  loadingUser: boolean;
  onSelectUser: (user: User) => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="sticky top-0 z-10 bg-surface p-2 border-b border-border">
        <FormInput
          autoFocus
          placeholder="Search for a member"
          type="search"
          icon={FaMoneyBillWave}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {loadingUser && <ListingSkeleton items={4} />}
        {!loadingUser && users.length > 0 ? (
          users.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="w-full text-left border border-border bg-surface rounded-xl p-3 flex gap-4 items-center cursor-pointer transition hover:bg-surface/70 active:scale-[0.99]"
            >
              <img
                src={
                  user.photo
                    ? `${import.meta.env.VITE_BASE_URL.split("/api/")[0]}/${
                        user.photo
                      }`
                    : avatar
                }
                alt={user.first_name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm flex-shrink-0"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-text truncate">
                  {user.first_name} {user.middle_name || ""} {user.last_name}
                </span>
                <span className="text-sm text-text-secondary/70 truncate">
                  {user.primary_phone}
                </span>
              </div>
            </button>
          ))
        ) : (
          <p className="text-sm text-text-placeholder text-center py-6">
            No users found
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-surface">
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
