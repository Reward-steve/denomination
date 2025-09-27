// src/features/finance/pages/components/PaymentModal.tsx
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useInitPayment } from "../../../hook/useFinance";
import type { InitPaymentRequest } from "../../../types";
import { BaseModal } from "../../../../../components/ui/BaseModal";
import { useDebounce } from "../../../hook/useDebounce";
import { PaymentForm } from "./PaymentForm";
import { UserList } from "./UserList";
import { fetchUsers } from "../../Users/services";

/* -------------------- Types -------------------- */
export interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  primary_phone: string;
  photo?: string;
}

interface PaymentModalProps {
  onClose: () => void;
  user?: User; // optional pre-selected user
}

export function PaymentModal({ onClose, user }: PaymentModalProps) {
  const { mutate, isPending } = useInitPayment();

  // If user is passed, start on payment step
  const [step, setStep] = useState<"select-user" | "payment">(
    user ? "payment" : "select-user"
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(user ?? null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (user) return; // skip fetching if user pre-selected

    const _fetchUsers = async () => {
      setLoadingUser(true);
      try {
        const {
          data: { data },
        } = await fetchUsers({ search: debouncedSearch });
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoadingUser(false);
      }
    };

    _fetchUsers();
  }, [debouncedSearch, user]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setStep("payment");
  };

  const handleBack = () => {
    if (user) {
      // if user was pre-selected, prevent going back
      onClose();
    } else {
      setStep("select-user");
      setSelectedUser(null);
    }
  };

  const handlePay = (payload: InitPaymentRequest) => {
    mutate(payload, {
      onSuccess: () => {
        onClose();
      },
      onError: (err) => {
        console.error("Payment failed:", err);
      },
    });
  };

  return ReactDOM.createPortal(
    <BaseModal
      title={
        step === "select-user"
          ? "Choose a Member"
          : selectedUser
          ? `Payment for ${selectedUser.first_name} ${selectedUser.last_name}`
          : "Payment"
      }
      isOpen
      setClose={onClose}
    >
      {step === "select-user" ? (
        <UserList
          key={search}
          search={search}
          setSearch={setSearch}
          users={users}
          loadingUser={loadingUser}
          onSelectUser={handleSelectUser}
          onClose={onClose}
        />
      ) : selectedUser ? (
        <PaymentForm
          selectedUser={selectedUser}
          onBack={handleBack}
          onPay={handlePay}
          isPending={isPending}
        />
      ) : (
        <p className="text-center text-error py-6">No user selected.</p>
      )}
    </BaseModal>,
    document.body
  );
}
