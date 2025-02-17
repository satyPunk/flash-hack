import React from "react";

const NoticeBoard = () => {
  const notices = [
    {
      id: 1,
      title: "Upcoming Examination Schedule",
      description: "Check out the latest exam dates for your department.",
      date: "2025-02-20",
    },
    {
      id: 2,
      title: "College Fest 2025",
      description: "Join us for a fun-filled event with competitions and prizes!",
      date: "2025-03-05",
    },
    {
      id: 3,
      title: "Library Timings Updated",
      description: "New library hours effective from next week.",
      date: "2025-02-25",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Notices */}
      <div className="w-1/2 bg-white p-10">
        <h1 className="text-3xl font-bold mb-6">Notice Board</h1>
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="mb-6 p-4 border rounded-lg shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{notice.title}</h2>
            <p className="text-gray-600 mt-2">{notice.description}</p>
            <p className="text-sm text-blue-500 mt-2">{notice.date}</p>
          </div>
        ))}
      </div>

      {/* Right Section - Info Panel */}
      <div className="w-1/2 bg-blue-600 text-white flex items-center justify-center p-10">
        <div>
          <h2 className="text-4xl font-bold mb-4">Digital Notice Board</h2>
          <p className="text-lg">
            Stay updated with all college announcements in one centralized place.
            Access notices based on your department and year.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoticeBoard;
