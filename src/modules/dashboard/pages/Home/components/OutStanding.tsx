import clsx from "clsx";
import { Button } from "../../../../../components/ui/Button";
interface StatCardProps {
  amount: string;
  fee: string;
  times: string;
  onPayNow?: () => void;
  showPayNow?: boolean;
}

const OutStanding = ({
  amount,
  fee,
  times,
  onPayNow,
  showPayNow,
}: StatCardProps) => (
  <div
    className={clsx(
      "p-6 rounded-2xl bg-surface shadow-sm",
      "hover:shadow-md hover:bg-surface/60 transition-all duration-200 animate-fade border border-border"
    )}
  >
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-text">{amount}</h2>
        <div className="text-error">{times}</div>
      </div>
      <p className="mt-0.5 text-[16px] text-text-placeholder">{fee}</p>
      {/* <p className="mt-1 text-2xl font-bold text-primary">{fee}</p> */}
    </div>
    <div className="max-w-[100px] mt-2">
      {showPayNow && (
        <Button
          onClick={onPayNow}
          variant="gray"
          size="sm"
          className="w-full sm:w-auto animate-fade transition-all"
        >
          Pay now
        </Button>
      )}
    </div>
  </div>
);
export default OutStanding;
