import { useRegisterSW } from "virtual:pwa-register/react";
import { useState } from "react";

export default function PwaUpdater() {
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);
  const { updateServiceWorker } = useRegisterSW({
    onOfflineReady() {
      setOfflineReady(true);
    },
    onNeedRefresh() {
      setNeedRefresh(true);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {(offlineReady || needRefresh) && (
        <div className="bg-surface border border-border shadow-lg rounded-lg p-4 flex items-center gap-3 animate-fade">
          <div className="text-sm text-text">
            {offlineReady && <span>App is ready to work offline 🎉</span>}
            {needRefresh && <span>New version available!</span>}
          </div>

          {needRefresh && (
            <button
              className="px-3 py-1 text-sm rounded bg-accent text-white hover:bg-accent/80"
              onClick={() => updateServiceWorker(true)}
            >
              Update
            </button>
          )}
          <button
            className="ml-2 text-xs text-gray-500 hover:text-gray-700"
            onClick={close}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
