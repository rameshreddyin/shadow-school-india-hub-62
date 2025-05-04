
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Notice } from '@/types/notice';
import { Edit, Eye, MoreVertical, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import EditNoticeDialog from './EditNoticeDialog';

// Mock data for demonstration purposes
const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'End of Year Ceremony',
    body: 'Please join us for the end of year ceremony on May 30th at 10:00 AM in the main auditorium.',
    audience: 'all',
    priority: 'medium',
    createdAt: '2025-05-01T09:00:00Z',
    visibleFrom: '2025-05-01T00:00:00Z',
    visibleUntil: '2025-05-30T23:59:59Z',
    status: 'published'
  },
  {
    id: '2',
    title: 'Teacher Training Day',
    body: 'There will be a teacher training day on May 15th. All teachers must attend.',
    audience: 'teachers',
    priority: 'high',
    createdAt: '2025-05-02T10:30:00Z',
    visibleFrom: '2025-05-02T00:00:00Z',
    visibleUntil: '2025-05-15T23:59:59Z',
    status: 'published'
  },
  {
    id: '3',
    title: 'Parent-Teacher Conference',
    body: 'Parent-teacher conferences will be held on May 20th from 1:00 PM to 5:00 PM.',
    audience: 'parents',
    priority: 'high',
    createdAt: '2025-05-03T14:45:00Z',
    visibleFrom: '2025-05-03T00:00:00Z',
    visibleUntil: '2025-05-20T23:59:59Z',
    status: 'published'
  },
  {
    id: '4',
    title: 'Final Exams Schedule',
    body: 'Final examinations will be held from May 25th to May 29th. Please check the detailed schedule.',
    audience: 'students',
    priority: 'urgent',
    createdAt: '2025-05-04T11:20:00Z',
    visibleFrom: '2025-05-04T00:00:00Z',
    visibleUntil: '2025-05-29T23:59:59Z',
    status: 'published'
  },
  {
    id: '5',
    title: 'Summer Break Announcement',
    body: 'Summer break will begin on June 1st. School will resume on August 15th.',
    audience: 'all',
    priority: 'low',
    createdAt: '2025-05-05T09:15:00Z',
    visibleFrom: '2025-05-05T00:00:00Z',
    visibleUntil: '2025-06-01T23:59:59Z',
    status: 'draft'
  }
];

const NoticesList: React.FC = () => {
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const isMobile = useIsMobile();

  const handleDeleteNotice = (id: string) => {
    setNotices(notices.filter(notice => notice.id !== id));
    toast({
      title: "Notice deleted",
      description: "Notice has been successfully deleted.",
    });
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
  };

  const handleSaveEdit = (updatedNotice: Notice) => {
    setNotices(notices.map(notice => 
      notice.id === updatedNotice.id ? updatedNotice : notice
    ));
    setEditingNotice(null);
    toast({
      title: "Notice updated",
      description: "Notice has been successfully updated.",
    });
  };

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

  const getStatusBadge = (status: Notice['status']) => {
    const variants: Record<Notice['status'], string> = {
      draft: 'bg-gray-200 text-gray-700',
      published: 'bg-green-500 text-white',
      expired: 'bg-gray-400 text-white',
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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

  if (isMobile) {
    return (
      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className="p-4 shadow-sm">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="font-medium">{notice.title}</div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditNotice(notice)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteNotice(notice.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex flex-wrap gap-2 mb-2">
                {getAudienceBadge(notice.audience)}
                {getPriorityBadge(notice.priority)}
                {getStatusBadge(notice.status)}
              </div>
              <div>
                <span className="text-muted-foreground">Visible: </span>
                {format(new Date(notice.visibleFrom), 'MMM d')} - {format(new Date(notice.visibleUntil), 'MMM d, yyyy')}
              </div>
            </div>
          </Card>
        ))}
        {editingNotice && (
          <EditNoticeDialog 
            notice={editingNotice}
            onClose={() => setEditingNotice(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead>Visibility Dates</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notices.map((notice) => (
            <TableRow key={notice.id}>
              <TableCell className="font-medium">{notice.title}</TableCell>
              <TableCell>{getAudienceBadge(notice.audience)}</TableCell>
              <TableCell>
                {format(new Date(notice.visibleFrom), 'MMM d')} - {format(new Date(notice.visibleUntil), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>{getPriorityBadge(notice.priority)}</TableCell>
              <TableCell>{getStatusBadge(notice.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditNotice(notice)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteNotice(notice.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingNotice && (
        <EditNoticeDialog 
          notice={editingNotice}
          onClose={() => setEditingNotice(null)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default NoticesList;
