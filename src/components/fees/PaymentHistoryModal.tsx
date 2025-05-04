
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: any | null;
}

// Mock data for payment history
const mockPaymentHistory = {
  1: [ // For student with id 1
    {
      id: 101,
      term: "Term 1",
      dueAmount: 15000,
      paidAmount: 15000,
      paymentDate: "2024-04-15",
      paymentMode: "Cash",
      receiptNo: "REC-001",
      status: "paid"
    },
    {
      id: 102,
      term: "Term 2",
      dueAmount: 15000,
      paidAmount: 15000,
      paymentDate: "2024-07-12",
      paymentMode: "UPI",
      receiptNo: "REC-045",
      status: "paid"
    },
    {
      id: 103,
      term: "Term 3",
      dueAmount: 15000,
      paidAmount: 15000,
      paymentDate: "2024-10-08",
      paymentMode: "Bank Transfer",
      receiptNo: "REC-089",
      status: "paid"
    },
  ],
  2: [ // For student with id 2
    {
      id: 201,
      term: "Term 1",
      dueAmount: 15000,
      paidAmount: 15000,
      paymentDate: "2024-04-18",
      paymentMode: "Cheque",
      receiptNo: "REC-023",
      status: "paid"
    },
    {
      id: 202,
      term: "Term 2",
      dueAmount: 15000,
      paidAmount: 7500,
      paymentDate: "2024-07-22",
      paymentMode: "Cash",
      receiptNo: "REC-067",
      status: "partial"
    },
    {
      id: 203,
      term: "Term 3",
      dueAmount: 15000,
      paidAmount: 0,
      paymentDate: null,
      paymentMode: null,
      receiptNo: null,
      status: "pending"
    },
  ],
  3: [ // For student with id 3
    {
      id: 301,
      term: "Term 1",
      dueAmount: 14000,
      paidAmount: 0,
      paymentDate: null,
      paymentMode: null,
      receiptNo: null,
      status: "pending"
    },
    {
      id: 302,
      term: "Term 2",
      dueAmount: 14000,
      paidAmount: 0,
      paymentDate: null,
      paymentMode: null,
      receiptNo: null,
      status: "pending"
    },
    {
      id: 303,
      term: "Term 3",
      dueAmount: 14000,
      paidAmount: 0,
      paymentDate: null,
      paymentMode: null,
      receiptNo: null,
      status: "pending"
    },
  ]
};

const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  isOpen,
  onClose,
  student
}) => {
  // Don't render if no student is selected
  if (!student) return null;

  // Get payment history for the selected student
  const paymentHistory = mockPaymentHistory[student.id as keyof typeof mockPaymentHistory] || [];

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment History for {student.name}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="rounded-md border mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Term</TableHead>
                  <TableHead className="text-right">Due Amount (₹)</TableHead>
                  <TableHead className="text-right">Paid Amount (₹)</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Receipt No.</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.term}</TableCell>
                      <TableCell className="text-right">{payment.dueAmount.toLocaleString('en-IN')}</TableCell>
                      <TableCell className="text-right">{payment.paidAmount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>{payment.paymentDate || '-'}</TableCell>
                      <TableCell>{payment.paymentMode || '-'}</TableCell>
                      <TableCell>{payment.receiptNo || '-'}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">No payment records found</TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell className="text-right font-medium">{student.totalFee.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right font-medium">{student.paidAmount.toLocaleString('en-IN')}</TableCell>
                  <TableCell colSpan={3}></TableCell>
                  <TableCell>
                    {getStatusBadge(student.status)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="bg-muted/30 rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium mb-2">Payment Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Fee</p>
                <p className="text-lg font-medium">₹{student.totalFee.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Amount</p>
                <p className="text-lg font-medium">₹{student.paidAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="text-lg font-medium">₹{student.balance.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentHistoryModal;
