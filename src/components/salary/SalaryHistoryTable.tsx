
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Filter } from 'lucide-react';
import ResponsiveTable from '@/components/ui/responsive-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock payment history data
const paymentHistory = [
  {
    id: '1',
    staffId: 'TCH001',
    staffName: 'Dr. Rahul Sharma',
    department: 'Science',
    amount: 45000,
    date: '2025-05-21',
    month: 'May',
    year: 2025,
    paymentMethod: 'bank',
    reference: 'TRX123456',
  },
  {
    id: '2',
    staffId: 'TCH002',
    staffName: 'Priya Patel',
    department: 'Mathematics',
    amount: 38000,
    date: '2025-05-20',
    month: 'May',
    year: 2025,
    paymentMethod: 'bank',
    reference: 'TRX123457',
  },
  {
    id: '3',
    staffId: 'TCH003',
    staffName: 'Anil Kumar',
    department: 'Languages',
    amount: 32000,
    date: '2025-05-20',
    month: 'May',
    year: 2025,
    paymentMethod: 'bank',
    reference: 'TRX123458',
  },
  {
    id: '4',
    staffId: 'TCH001',
    staffName: 'Dr. Rahul Sharma',
    department: 'Science',
    amount: 45000,
    date: '2025-04-20',
    month: 'April',
    year: 2025,
    paymentMethod: 'bank',
    reference: 'TRX123423',
  },
  {
    id: '5',
    staffId: 'TCH002',
    staffName: 'Priya Patel',
    department: 'Mathematics',
    amount: 38000,
    date: '2025-04-20',
    month: 'April',
    year: 2025,
    paymentMethod: 'bank',
    reference: 'TRX123424',
  },
];

interface SalaryHistoryTableProps {
  month: string;
  year: string;
}

const SalaryHistoryTable: React.FC<SalaryHistoryTableProps> = ({
  month,
  year,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('All Methods');

  // Filter payment history based on month, year, search query, and payment method
  const filteredHistory = paymentHistory.filter((payment) => {
    const matchesMonthYear = payment.month === month && payment.year === parseInt(year);
    const matchesSearch = 
      payment.staffName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      payment.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPaymentMethod = paymentMethod === 'All Methods' || 
      payment.paymentMethod === paymentMethod.toLowerCase();
    
    return matchesMonthYear && matchesSearch && matchesPaymentMethod;
  });

  // Format payment method for display
  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case 'bank':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      case 'check':
        return 'Check';
      case 'online':
        return 'Online Payment';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID or reference"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Methods">All Methods</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="Check">Check</SelectItem>
              <SelectItem value="Online Payment">Online Payment</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <ResponsiveTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No payment records found for {month} {year}
                  </TableCell>
                </TableRow>
              ) : (
                filteredHistory.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.staffName}</div>
                        <div className="text-xs text-muted-foreground">{payment.staffId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{payment.department}</TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {formatPaymentMethod(payment.paymentMethod)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono">{payment.reference}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ResponsiveTable>
      </div>
    </div>
  );
};

export default SalaryHistoryTable;
