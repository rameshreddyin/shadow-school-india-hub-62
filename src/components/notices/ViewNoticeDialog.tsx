
import React from 'react';
import { format } from 'date-fns';
import { Notice } from '@/types/notice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';

interface ViewNoticeDialogProps {
  notice: Notice;
  onClose: () => void;
}

const ViewNoticeDialog: React.FC<ViewNoticeDialogProps> = ({
  notice,
  onClose,
}) => {
  const getPriorityBadge = (priority: Notice['priority']) => {
    const variants: Record<Notice['priority'], string> = {
      low: 'bg-gray-500 text-white',
      medium: 'bg-blue-500 text-white',
      high: 'bg-amber-500 text-white',
      urgent: 'bg-red-500 text-white',
    };
    
    return (
      <Badge className={variants[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getAudienceBadge = (audience: Notice['audience']) => {
    const variants: Record<Notice['audience'], string> = {
      all: 'bg-purple-500 text-white',
      teachers: 'bg-cyan-500 text-white',
      students: 'bg-indigo-500 text-white',
      parents: 'bg-emerald-500 text-white',
    };
    
    const labels: Record<Notice['audience'], string> = {
      all: 'All',
      teachers: 'Teachers',
      students: 'Students',
      parents: 'Parents',
    };
    
    return (
      <Badge className={variants[audience]}>
        {labels[audience]}
      </Badge>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <DialogTitle>{notice.title}</DialogTitle>
            <div className="flex gap-2">
              {getPriorityBadge(notice.priority)}
              {getAudienceBadge(notice.audience)}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Posted on {format(new Date(notice.createdAt), 'MMMM d, yyyy')}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="whitespace-pre-line">{notice.body}</div>
          
          <div className="text-sm text-muted-foreground">
            Visible from {format(new Date(notice.visibleFrom), 'MMMM d, yyyy')} to{' '}
            {format(new Date(notice.visibleUntil), 'MMMM d, yyyy')}
          </div>
          
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="space-y-1">
              <div className="font-medium text-sm">Attachments:</div>
              <div className="flex flex-wrap gap-2">
                {notice.attachments.map((attachment, index) => (
                  <Button key={index} variant="outline" size="sm">
                    <Download className="h-3.5 w-3.5 mr-1" /> 
                    {attachment.split('/').pop()}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewNoticeDialog;
