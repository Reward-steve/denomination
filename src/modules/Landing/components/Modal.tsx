import { Login } from "../../auth/pages/LoginModal";

interface ModalProps {
  showLogin: boolean;
  handleCloseLogin: () => void;
}

export function Modal({ showLogin, handleCloseLogin }: ModalProps) {
  return <Login handleCloseLogin={handleCloseLogin} showLogin={showLogin} />;
}
