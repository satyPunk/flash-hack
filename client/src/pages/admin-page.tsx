import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { NoticeList } from "@/components/notice-list";
import { NoticeForm } from "@/components/notice-form";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

export default function AdminPage() {
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (user?.role === 'student') {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Notice Management</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => setLocation('/')}
            >
              View Board
            </Button>
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
        <div className="mb-8 flex justify-end">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Notice</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <NoticeForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <NoticeList 
          showControls
          filters={{
            authorId: user?.role === 'admin' ? undefined : user?.id
          }}
        />
      </main>
    </div>
  );
}
