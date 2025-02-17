import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Notice } from "@shared/schema";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NoticeForm } from "./notice-form";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NoticeCardProps {
  notice: Notice;
  showControls?: boolean;
}

export function NoticeCard({ notice, showControls }: NoticeCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const canModify = user?.role === 'admin' || notice.authorId === user?.id;

  const handleDelete = async () => {
    try {
      await apiRequest('DELETE', `/api/notices/${notice.id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/notices'] });
      toast({
        title: "Notice deleted",
        description: "The notice has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the notice.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle>{notice.title}</CardTitle>
          {showControls && canModify && (
            <div className="flex gap-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <NoticeForm 
                    notice={notice}
                    onSuccess={() => setIsEditDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
              <Button size="icon" variant="ghost" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{notice.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{notice.category}</Badge>
          {notice.global && <Badge variant="default">Global</Badge>}
          {notice.departments?.map((dept) => (
            <Badge key={dept} variant="outline">{dept}</Badge>
          ))}
          {notice.academicYears?.map((year) => (
            <Badge key={year} variant="outline">{year}</Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Posted on {format(new Date(notice.createdAt), 'PPP')}
        </p>
      </CardFooter>
    </Card>
  );
}
