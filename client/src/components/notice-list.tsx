import { useQuery } from "@tanstack/react-query";
import { Notice } from "@shared/schema";
import { NoticeCard } from "./notice-card";
import { Loader2 } from "lucide-react";

interface NoticeListProps {
  showControls?: boolean;
  filters?: {
    search?: string;
    category?: string;
    department?: string;
    academicYear?: string;
    authorId?: number;
  };
}

export function NoticeList({ showControls, filters }: NoticeListProps) {
  const { data: notices, isLoading } = useQuery<Notice[]>({
    queryKey: ['/api/notices'],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!notices?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notices found
      </div>
    );
  }

  let filteredNotices = notices;

  if (filters) {
    filteredNotices = notices.filter((notice) => {
      if (filters.search && 
          !notice.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !notice.content.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      if (filters.category && notice.category !== filters.category) {
        return false;
      }

      if (filters.authorId && notice.authorId !== filters.authorId) {
        return false;
      }

      if (!notice.global) {
        if (filters.department && 
            notice.departments?.length &&
            !notice.departments.includes(filters.department)) {
          return false;
        }

        if (filters.academicYear &&
            notice.academicYears?.length &&
            !notice.academicYears.includes(filters.academicYear)) {
          return false;
        }
      }

      return true;
    });
  }

  return (
    <div className="grid gap-6">
      {filteredNotices.map((notice) => (
        <NoticeCard
          key={notice.id}
          notice={notice}
          showControls={showControls}
        />
      ))}
    </div>
  );
}
