import { Home, Send, Activity, Trophy, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Send", url: "/send", icon: Send },
  { title: "Activity", url: "/activity", icon: Activity },
  { title: "Board", url: "/leaderboard", icon: Trophy },
  { title: "Profile", url: "/profile", icon: User },
];

export function MobileNav() {
  return (
    <nav className="sticky bottom-0 z-40 flex items-center justify-around border-t bg-card/95 backdrop-blur-sm h-16 pb-safe">
      {items.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          end={item.url === "/"}
          className="flex flex-col items-center gap-0.5 px-3 py-2 text-muted-foreground text-[11px] transition-colors"
          activeClassName="text-primary font-medium"
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}
