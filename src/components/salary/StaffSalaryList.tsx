
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
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle, DollarSign, AlertCircle } from 'lucide-react';
import ResponsiveTable from '@/components/ui/responsive-table';
import SalaryDetailsDialog from './SalaryDetailsDialog';

// Mock staff data
const staffMembers = [
  {
    id: '1',
    name: 'Dr. Rahul Sharma',
    staffId: 'TCH001',
    department: 'Science',
    salary: 45000,
    isPaid: true,
    paymentDate: '2025-05-21',
  },
  {
    id: '2',
    name: 'Priya Patel',
    staffId: 'TCH002',
    department: 'Mathematics',
    salary: 38000,
    isPaid: true,
    paymentDate: '2025-05-20',
  },
  {
    id: '3',
    name: 'Anil Kumar',
    staffId: 'TCH003',
    department: 'Languages',
    salary: 32000,
    isPaid: true,
    paymentDate: '2025-05-20',
  },
  {
    id: '4',
    name: 'Meena Singh',
    staffId: 'ADM001',
    department: 'Administration',
    salary: 35000,
    isPaid: false,
    paymentDate: null,
  },
  {
    id: '5',
    name: 'Ravi Desai',
    staffId: 'FIN001',
    department: 'Finance',
    salary: 42000,
    isPaid: false,
    paymentDate: null,
  },
];

// Mock payment history data for details view
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
    deductions: 2000,
    bonuses: 5000,
    notes: 'Includes performance bonus for excellent research work.',
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
];

interface StaffSalaryListProps {
  month: string;
  year: string;
  searchQuery: string;
  departmentFilter: string;
  onRecordPayment: (staffId?: string) => void;
}

const StaffSalaryList: React.FC<StaffSalaryListProps> = ({
  month,
  year,
  searchQuery,
  departmentFilter,
  onRecordPayment,
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<(typeof paymentHistory)[0] | null>(null);

  // Filter staff based on search query and department
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      staff.staffId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'All Departments' || 
      staff.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Handle showing payment details
  const handleShowDetails = (staffId: string) => {
    const payment = paymentHistory.find(p => p.staffId === staffId);
    if (payment) {
      setSelectedPayment(payment);
      setIsDetailsOpen(true);
    }
  };

  // Handle pay button click - passing the staffId to the parent component
  const handlePayClick = (staffId: string) => {
    onRecordPayment(staffId);
  };

  return (
    <>
      <div className="rounded-md border">
        <ResponsiveTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No staff members found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-xs text-muted-foreground">{staff.staffId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell className="text-right">₹{staff.salary.toLocaleString()}</TableCell>
                    <TableCell>
                      {staff.isPaid ? (
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Paid
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {staff.paymentDate && new Date(staff.paymentDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {staff.isPaid ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleShowDetails(staff.staffId)}
                        >
                          Details
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handlePayClick(staff.staffId)}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Pay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ResponsiveTable>
      </div>

      {/* Payment Details Dialog */}
      <SalaryDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        payment={selectedPayment}
      />
    </>
  );
};

export default StaffSalaryList;
