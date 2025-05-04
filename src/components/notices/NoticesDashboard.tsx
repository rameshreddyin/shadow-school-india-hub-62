
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Notice } from '@/types/notice';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Download } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import ViewNoticeDialog from './ViewNoticeDialog';

// Mock data for demonstration purposes
const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'End of Year Ceremony',
    body: 'Please join us for the end of year ceremony on May 30th at 10:00 AM in the main auditorium. All students and parents are welcome to attend. There will be performances, awards, and refreshments.',
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
    body: 'There will be a teacher training day on May 15th. All teachers must attend. The training will cover new teaching methodologies and tools. Lunch will be provided.',
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
    body: 'Parent-teacher conferences will be held on May 20th from 1:00 PM to 5:00 PM. Please schedule your appointment through the online portal or by calling the school office.',
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
    body: 'Final examinations will be held from May 25th to May 29th. Please check the detailed schedule below and ensure you arrive at least 15 minutes before your exam time. Bring all necessary materials.',
    audience: 'students',
    priority: 'urgent',
    createdAt: '2025-05-04T11:20:00Z',
    visibleFrom: '2025-05-04T00:00:00Z',
    visibleUntil: '2025-05-29T23:59:59Z',
    status: 'published'
  }
];

const NoticesDashboard: React.FC = () => {
  const [activeNotices, setActiveNotices] = useState<Notice[]>([]);
  const [viewingNotice, setViewingNotice] = useState<Notice | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    // In a real app, you would fetch notices from an API
    // Filter notices that are currently active
    const now = new Date();
    const filtered = mockNotices.filter(notice => {
      const visibleFrom = new Date(notice.visibleFrom);
      const visibleUntil = new Date(notice.visibleUntil);
      return visibleFrom <= now && visibleUntil >= now && notice.status === 'published';
    });
    
    // Sort by priority (urgent first)
    filtered.sort((a, b) => {
      const priorityOrder: Record<Notice['priority'], number> = {
        urgent: 0,
        high: 1,
        medium: 2,
        low: 3
      };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    setActiveNotices(filtered);
  }, []);

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

  const getBodyPreview = (body: string, maxLength: number = 100) => {
    if (body.length <= maxLength) return body;
    return body.substring(0, maxLength) + '...';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Latest Notices</h2>
      </div>
      
      {activeNotices.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">No active notices to display.</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className={`${isMobile ? 'h-[500px]' : 'h-[600px]'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
            {activeNotices.map((notice) => (
              <Card key={notice.id} className="flex flex-col h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg">{notice.title}</CardTitle>
                    <div className="flex gap-1 flex-nowrap">
                      {getPriorityBadge(notice.priority)}
                      {getAudienceBadge(notice.audience)}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Posted on {format(new Date(notice.createdAt), 'MMMM d, yyyy')}
                  </div>
                </CardHeader>
                <CardContent className="py-2 flex-grow">
                  <p className="text-sm">{getBodyPreview(notice.body)}</p>
                </CardContent>
                <CardFooter className="pt-2 flex justify-between">
                  <Button variant="ghost" size="sm" onClick={() => setViewingNotice(notice)}>
                    <Eye className="h-4 w-4 mr-1" /> View
                  </Button>
                  {notice.attachments && notice.attachments.length > 0 && (
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" /> Attachment
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {viewingNotice && (
        <ViewNoticeDialog 
          notice={viewingNotice}
          onClose={() => setViewingNotice(null)}
        />
      )}
    </div>
  );
};

export default NoticesDashboard;
