import { MessageCircle } from "lucide-react";
import DashboardLayout from "../components/Layout";

export default function Chats() {
  return (
     <DashboardLayout>

    
    <div className="flex items-center justify-center min-h-[70vh] bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg border border-gray-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
          <MessageCircle className="w-5 h-5" />
          <h2 className="font-semibold text-lg">Chat Module</h2>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <MessageCircle className="w-16 h-16 text-indigo-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Coming Soon 🚀
          </h3>
          <p className="text-gray-500 text-sm">
            Our one-on-one chat feature is under development.  
            Stay tuned for a seamless messaging experience.
          </p>
        </div>

        {/* Disabled input */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <input
            type="text"
            disabled
            placeholder="Chat feature coming soon..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-500 bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>
    </div>
     </DashboardLayout>
  );
}
