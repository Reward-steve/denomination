import DashboardLayout from "../../components/Layout";
import { UnderConstruction } from "../../../../components/ui/UnderConstruction";
import { FaMusic } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function Songs() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <UnderConstruction
        title="Songs"
        description="We’re tuning things up to bring you song management soon. Stay tuned!"
        icon={<FaMusic className="w-20 h-20 text-primary/70 animate-pulse" />}
        actionLabel="Back to Dashboard"
        onAction={() => navigate("/dashboard")}
      />
    </DashboardLayout>
  );
}
