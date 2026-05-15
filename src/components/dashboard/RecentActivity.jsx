import React from "react";

const activities = [
  {
    icon: "book",
    iconFill: true,
    title: "New loan: The Great Gatsby",
    subtitle: "by Julian Thorne • 2 mins ago",
    color: "primary",
  },
  {
    icon: "person_add",
    iconFill: true,
    title: "New user registered",
    subtitle: "Sarah Jenkins • 45 mins ago",
    color: "primary",
  },
  {
    icon: "assignment_return",
    iconFill: true,
    title: "Book returned: Foundation",
    subtitle: "by Isaac Asimov • 2 hours ago",
    color: "primary",
  },
  {
    icon: "error",
    iconFill: true,
    title: "Late fine generated",
    subtitle: "ID: #88219 • 5 hours ago",
    color: "error",
  },
  {
    icon: "inventory_2",
    iconFill: true,
    title: "Archived new collection",
    subtitle: '"Vintage Classics" • 1 day ago',
    color: "primary",
  },
];

const RecentActivity = () => {
  return (
    <div className="bg-surface-container-low p-8 rounded-xl">
      <h3 className="font-headline font-bold text-lg mb-6">Recent Activity</h3>
      <div className="space-y-6">
        {activities.map((act, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div
              className={`h-10 w-10 shrink-0 rounded-full bg-white flex items-center justify-center text-${act.color} shadow-sm`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {act.icon}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold">{act.title}</p>
              <p className="text-xs text-on-surface-variant">{act.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-8 py-3 text-xs font-bold font-headline uppercase tracking-widest text-primary hover:bg-primary/5 rounded-lg transition-colors">
        View Full Audit Log
      </button>
    </div>
  );
};

export default RecentActivity;
