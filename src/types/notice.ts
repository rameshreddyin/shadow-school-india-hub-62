
export interface Notice {
  id: string;
  title: string;
  body: string;
  audience: 'all' | 'teachers' | 'students' | 'parents';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  createdAt: string;
  visibleFrom: string;
  visibleUntil: string;
  status: 'draft' | 'published' | 'expired';
}
