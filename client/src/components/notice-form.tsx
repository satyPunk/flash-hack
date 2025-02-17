import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertNoticeSchema, type Notice, type InsertNotice } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface NoticeFormProps {
  notice?: Notice;
  onSuccess?: () => void;
}

export function NoticeForm({ notice, onSuccess }: NoticeFormProps) {
  const { toast } = useToast();
  const form = useForm<InsertNotice>({
    resolver: zodResolver(insertNoticeSchema),
    defaultValues: notice ?? {
      title: "",
      content: "",
      category: "academic",
      departments: [],
      academicYears: [],
      global: false,
    },
  });

  const onSubmit = async (data: InsertNotice) => {
    try {
      if (notice) {
        await apiRequest('PATCH', `/api/notices/${notice.id}`, data);
      } else {
        await apiRequest('POST', '/api/notices', data);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/notices'] });
      toast({
        title: notice ? "Notice updated" : "Notice created",
        description: `The notice has been successfully ${notice ? 'updated' : 'created'}.`,
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${notice ? 'update' : 'create'} the notice.`,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="placement">Placement</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="clubs">Clubs</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="global"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between gap-2">
              <FormLabel>Global Notice</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {notice ? 'Update' : 'Create'} Notice
        </Button>
      </form>
    </Form>
  );
}
