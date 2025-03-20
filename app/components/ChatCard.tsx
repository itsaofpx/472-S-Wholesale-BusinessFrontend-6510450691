import { FaArrowRight } from "react-icons/fa";

function ChatCard() {
  return (
    <div className="flex flex-row justify-between p-[1.5rem] border border-gray-200">
      {/* Left Section */}
      <div className="flex flex-col bg-slate-200 w-4/5 gap-y-[2rem]">
        {/* Chat Details */}
        <div>UserID</div>
        <div>RecentText</div>
      </div>
      {/* Right section */}
      <div className="bg-purple-200 items-center justify-center w-1/5">
        <div>
          <FaArrowRight/>
        </div>
      </div>
    </div>
  );
}

export default ChatCard;
