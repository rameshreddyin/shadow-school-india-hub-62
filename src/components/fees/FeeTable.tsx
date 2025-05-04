
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, Eye } from "lucide-react";
import AddPaymentModal from './AddPaymentModal';
import PaymentHistoryModal from './PaymentHistoryModal';

// Mock data for demonstration
const mockFeeData = [
  {
    id: 1,
    name: "Aisha Singh",
    admissionNo: "ADM-2024-001",
    class: "10",
    section: "A",
    totalFee: 45000,
    paidAmount: 45000,
    balance: 0,
    status: "paid"
  },
  {
    id: 2,
    name: "Rahul Kumar",
    admissionNo: "ADM-2024-015",
    class: "10",
    section: "B",
    totalFee: 45000,
    paidAmount: 22500,
    balance: 22500,
    status: "partial"
  },
  {
    id: 3,
    name: "Maya Patel",
    admissionNo: "ADM-2024-023",
    class: "9",
    section: "A",
    totalFee: 42000,
    paidAmount: 0,
    balance: 42000,
    status: "pending"
  },
  {
    id: 4,
    name: "Arjun Sharma",
    admissionNo: "ADM-2024-042",
    class: "11",
    section: "C",
    totalFee: 50000,
    paidAmount: 35000,
    balance: 15000,
    status: "partial"
  },
  {
    id: 5,
    name: "Zara Khan",
    admissionNo: "ADM-2024-055",
    class: "12",
    section: "A",
    totalFee: 52000,
    paidAmount: 52000,
    balance: 0,
    status: "paid"
  }
];

const FeeTable: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  const handleAddPayment = (student: any) => {
    setSelectedStudent(student);
    setShowPaymentModal(true);
  };

  const handleViewHistory = (student: any) => {
    setSelectedStudent(student);
    setShowHistoryModal(true);
  };

  const handleSendPaymentLink = (student: any) => {
    // In a real app, this would trigger an API call to send a payment link
    alert(`Payment link sent to ${student.name}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Paid</Badge>;
      case 'partial':
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">Partial</Badge>;
      case 'pending':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Admission No.</TableHead>
              <TableHead>Class/Section</TableHead>
              <TableHead className="text-right">Total Fee (₹)</TableHead>
              <TableHead className="text-right">Paid (₹)</TableHead>
              <TableHead className="text-right">Balance (₹)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockFeeData.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.admissionNo}</TableCell>
                <TableCell>Class {student.class} - {student.section}</TableCell>
                <TableCell className="text-right">{student.totalFee.toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-right">{student.paidAmount.toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-right">{student.balance.toLocaleString('en-IN')}</TableCell>
                <TableCell>{getStatusBadge(student.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleAddPayment(student)}
                      title="Add Payment"
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleSendPaymentLink(student)}
                      title="Send Payment Link"
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleViewHistory(student)}
                      title="View History"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <AddPaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        student={selectedStudent} 
      />
      
      <PaymentHistoryModal 
        isOpen={showHistoryModal} 
        onClose={() => setShowHistoryModal(false)} 
        student={selectedStudent} 
      />
    </>
  );
};

export default FeeTable;
