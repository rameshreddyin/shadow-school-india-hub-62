
export interface Notice {
  id: string;
  title: string;
  body: string;
  audience: 'all' | 'teachers' | 'students' | 'parents';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  visibleFrom: string;
  visibleUntil: string;
  createdAt: string;
  status: 'draft' | 'published' | 'expired';
  attachments?: string[];
}
