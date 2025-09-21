import { useNavigate } from "react-router-dom";
import { UnderConstruction } from "../../../../components/ui/UnderConstruction";
import DashboardLayout from "../../components/Layout";
import { FaBookOpen } from "react-icons/fa6";

export default function Sermon() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <UnderConstruction
        title="Sermon Page Coming Soon"
        description="Soon you’ll be able to listen to, read, and revisit inspiring sermons right here. Stay tuned!"
        icon={
          <FaBookOpen className="w-20 h-20 text-primary/70 animate-pulse" />
        }
        actionLabel="Back to Dashboard"
        onAction={() => navigate("/dashboard")}
      />
    </DashboardLayout>
  );
}
