import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { NoticeList } from "@/components/notice-list";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Digital Notice Board</h1>
          <div className="flex items-center gap-4">
            {(user?.role === 'admin' || user?.role === 'faculty') && (
              <Button
                variant="secondary"
                onClick={() => setLocation('/admin')}
              >
                Manage Notices
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Search notices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="placement">Placement</SelectItem>
              <SelectItem value="events">Events</SelectItem>
              <SelectItem value="clubs">Clubs</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <NoticeList
          filters={{
            search,
            category: categoryFilter,
            department: user?.department,
            academicYear: user?.academicYear,
          }}
        />
      </main>
    </div>
  );
}
