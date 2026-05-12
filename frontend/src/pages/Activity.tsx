import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRecentTips, microStxToStx, type Tip } from "@/lib/contract";
import { AppShell } from "@/components/AppShell";
import { ActivityList } from "@/components/ActivityList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";

const PAGE_SIZE = 10;

function filterTips(tips: Tip[], query: string): Tip[] {
  if (!query.trim()) return tips;
  const q = query.toLowerCase().trim();
  return tips.filter(
    (tip) =>
      tip.sender.toLowerCase().includes(q) ||
      tip.recipient.toLowerCase().includes(q) ||
      tip.message.toLowerCase().includes(q) ||
      microStxToStx(tip.amount).toString().includes(q)
  );
}

export default function ActivityPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["tips-activity", page],
    queryFn: () => getRecentTips(page, PAGE_SIZE),
  });

  const filteredTips = useMemo(
    () => filterTips(data?.tips ?? [], search),
    [data?.tips, search]
  );

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  return (
    <AppShell>
      <div className="py-4 md:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Activity</h1>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by address, message, amount…"
              value={search}
              onChange={handleSearchChange}
              className="pl-9 pr-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <ActivityList tips={filteredTips} loading={isLoading} />
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-3">
              Page {page + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
