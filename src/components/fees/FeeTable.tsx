
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
import { CreditCard, Calendar, Eye, Send } from "lucide-react";
import AddPaymentModal from './AddPaymentModal';
import PaymentHistoryModal from './PaymentHistoryModal';

interface FeeTableProps {
  currentTerm: string;
  isMobile: boolean;
}

// Enhanced mock data for demonstration
const mockFeeData = [
  {
    id: 1,
    name: "Aisha Singh",
    admissionNo: "ADM-2024-001",
    class: "10",
    section: "A",
    paymentMode: "full-year",
    totalFee: 45000,
    paidAmount: 45000,
    balance: 0,
    termDue: 0,
    status: "paid"
  },
  {
    id: 2,
    name: "Rahul Kumar",
    admissionNo: "ADM-2024-015",
    class: "10",
    section: "B",
    paymentMode: "term-wise",
    totalFee: 45000,
    paidAmount: 22500,
    balance: 22500,
    termDue: 11250,
    status: "partial"
  },
  {
    id: 3,
    name: "Maya Patel",
    admissionNo: "ADM-2024-023",
    class: "9",
    section: "A",
    paymentMode: "term-wise",
    totalFee: 42000,
    paidAmount: 0,
    balance: 42000,
    termDue: 10500,
    status: "pending"
  },
  {
    id: 4,
    name: "Arjun Sharma",
    admissionNo: "ADM-2024-042",
    class: "11",
    section: "C",
    paymentMode: "term-wise",
    totalFee: 50000,
    paidAmount: 35000,
    balance: 15000,
    termDue: 0,
    status: "partial"
  },
  {
    id: 5,
    name: "Zara Khan",
    admissionNo: "ADM-2024-055",
    class: "12",
    section: "A",
    paymentMode: "full-year",
    totalFee: 52000,
    paidAmount: 52000,
    balance: 0,
    termDue: 0,
    status: "paid"
  },
  {
    id: 6,
    name: "Vikram Malhotra",
    admissionNo: "ADM-2024-072",
    class: "11",
    section: "A",
    paymentMode: "term-wise",
    totalFee: 50000,
    paidAmount: 12500,
    balance: 37500,
    termDue: 12500,
    status: "partial"
  },
  {
    id: 7,
    name: "Priya Desai",
    admissionNo: "ADM-2024-089",
    class: "9",
    section: "B",
    paymentMode: "full-year",
    totalFee: 42000,
    paidAmount: 42000,
    balance: 0,
    termDue: 0,
    status: "paid"
  }
];

const FeeTable: React.FC<FeeTableProps> = ({ currentTerm, isMobile }) => {
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

  const getPaymentModeDisplay = (mode: string) => {
    return mode === 'full-year' ? 'Full-Year' : 'Term-wise';
  };

  // Mobile view renders a card-based layout
  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {mockFeeData.map((student) => (
            <div key={student.id} className="bg-card border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{student.name}</h3>
                {getStatusBadge(student.status)}
              </div>
              
              <div className="text-sm text-muted-foreground mt-1">
                {student.admissionNo} • Class {student.class}-{student.section}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Payment Mode</p>
                  <p>{getPaymentModeDisplay(student.paymentMode)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Fee</p>
                  <p>₹{student.totalFee.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Paid</p>
                  <p>₹{student.paidAmount.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Balance</p>
                  <p>₹{student.balance.toLocaleString('en-IN')}</p>
                </div>
                {student.paymentMode === 'term-wise' && student.termDue > 0 && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">{currentTerm} Due</p>
                    <p>₹{student.termDue.toLocaleString('en-IN')}</p>
                  </div>
                )}
              </div>
              
              <div className="flex mt-4 space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddPayment(student)}
                  className="flex-1"
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Add Payment
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewHistory(student)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  History
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSendPaymentLink(student)}
                className="w-full mt-2"
              >
                <Send className="h-4 w-4 mr-1" />
                Send Link
              </Button>
            </div>
          ))}
        </div>

        {/* Modals */}
        <AddPaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)} 
          student={selectedStudent} 
          currentTerm={currentTerm}
        />
        
        <PaymentHistoryModal 
          isOpen={showHistoryModal} 
          onClose={() => setShowHistoryModal(false)} 
          student={selectedStudent} 
        />
      </>
    );
  }

  // Desktop view renders a table
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Admission No.</TableHead>
              <TableHead>Class/Section</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead className="text-right">Total Fee (₹)</TableHead>
              <TableHead className="text-right">Paid (₹)</TableHead>
              <TableHead className="text-right">Balance (₹)</TableHead>
              {/* Only show term due column if there are term-wise students */}
              {mockFeeData.some(s => s.paymentMode === 'term-wise') && (
                <TableHead className="text-right">{currentTerm} Due (₹)</TableHead>
              )}
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
                <TableCell>{getPaymentModeDisplay(student.paymentMode)}</TableCell>
                <TableCell className="text-right">{student.totalFee.toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-right">{student.paidAmount.toLocaleString('en-IN')}</TableCell>
                <TableCell className="text-right">{student.balance.toLocaleString('en-IN')}</TableCell>
                {mockFeeData.some(s => s.paymentMode === 'term-wise') && (
                  <TableCell className="text-right">
                    {student.paymentMode === 'term-wise' ? student.termDue.toLocaleString('en-IN') : '-'}
                  </TableCell>
                )}
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
                      <Send className="h-4 w-4" />
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
        currentTerm={currentTerm}
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
