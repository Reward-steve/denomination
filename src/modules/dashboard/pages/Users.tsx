import { useState } from "react";
import DashboardLayout from "../components/Layout";
import { Button } from "../../../components/ui/Button";
import { FaUserPlus, FaUserCircle } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState("");

  const handleAddUser = () => {
    if (newUser.trim()) {
      setUsers([...users, newUser.trim()]);
      setNewUser("");
      setIsModalOpen(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="space-y-6 animate-fade">
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text">Manage Users</h2>
            <p className="text-text-placeholder mt-1">
              Add and manage people who can access your account. Keep your team
              organized and up to date.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            className="gap-2"
          >
            <FaUserPlus /> Add User
          </Button>
        </header>

        {/* Users List */}
        {users.length === 0 ? (
          <div className="rounded-xl p-6 text-center text-text-placeholder">
            No users added yet. Click <b>“Add User”</b> to get started.
          </div>
        ) : (
          <ul className="space-y-3">
            {users.map((user, index) => (
              <li
                key={index}
                className="flex items-center gap-3 p-4 bg-surface rounded-xl shadow-sm"
              >
                <FaUserCircle className="text-2xl text-text-placeholder shrink-0" />
                <span className="text-text break-words">{user}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-surface rounded-2xl shadow-lg p-6 w-full max-w-md space-y-4">
              <h3 className="text-xl font-semibold text-text">
                Add a New User
              </h3>
              <p className="text-sm text-text-placeholder">
                Enter the full name of the user you want to add.
              </p>

              <input
                type="text"
                placeholder="e.g., John Doe"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 text-text placeholder:text-text-placeholder focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleAddUser}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
