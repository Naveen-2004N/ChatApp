import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser, typingUsers, lastSeen } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);
  const isTyping = typingUsers[selectedUser._id];

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 px-6">
      <div className="flex items-center space-x-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">
            {selectedUser.fullName}
          </h3>

          <p className="text-slate-400 text-sm">
            {isTyping
              ? "Typing..."
              : isOnline
              ? "Online"
              : lastSeen[selectedUser._id]
              ? `Last seen ${new Date(
                  lastSeen[selectedUser._id]
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Offline"}
          </p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200" />
      </button>
    </div>
  );
}

export default ChatHeader;