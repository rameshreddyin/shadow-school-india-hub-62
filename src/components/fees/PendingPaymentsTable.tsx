
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for pending payments
const mockPendingPayments = [
  {
    id: 1,
    studentName: "Rahul Kumar",
    studentId: 2,
    admissionNo: "ADM-2024-015",
    term: "Term 2",
    amount: 7500,
    class: "10",
    section: "B",
    paymentDate: "2024-07-18",
    paymentMode: "UPI",
    screenshot: "/placeholder.svg",
    notes: "Payment completed via PhonePe. Please approve.",
    status: "pending"
  },
  {
    id: 2,
    studentName: "Maya Patel",
    studentId: 3,
    admissionNo: "ADM-2024-023",
    term: "Term 1",
    amount: 14000,
    class: "9",
    section: "A",
    paymentDate: "2024-07-19",
    paymentMode: "Bank Transfer",
    screenshot: "/placeholder.svg",
    notes: "NEFT transfer completed. Reference: NEFT123456789",
    status: "pending"
  }
];

const PendingPaymentsTable: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject'>('approve');

  const handleView = (payment: any) => {
    setSelectedPayment(payment);
    setIsPreviewOpen(true);
  };

  const handleConfirm = (payment: any, action: 'approve' | 'reject') => {
    setSelectedPayment(payment);
    setConfirmAction(action);
    setIsConfirmOpen(true);
  };

  const processAction = () => {
    if (!selectedPayment) return;

    if (confirmAction === 'approve') {
      // In a real app, this would call an API to approve the payment
      toast({
        title: "Payment Approved",
        description: `Payment of ₹${selectedPayment.amount} from ${selectedPayment.studentName} has been approved.`
      });
    } else {
      // In a real app, this would call an API to reject the payment
      toast({
        title: "Payment Rejected",
        description: `Payment of ₹${selectedPayment.amount} from ${selectedPayment.studentName} has been rejected.`
      });
    }

    setIsConfirmOpen(false);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Admission No.</TableHead>
              <TableHead>Term</TableHead>
              <TableHead className="text-right">Amount (₹)</TableHead>
              <TableHead>Payment Mode</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPendingPayments.length > 0 ? (
              mockPendingPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.studentName}</TableCell>
                  <TableCell>{payment.admissionNo}</TableCell>
                  <TableCell>{payment.term}</TableCell>
                  <TableCell className="text-right">{payment.amount.toLocaleString('en-IN')}</TableCell>
                  <TableCell>{payment.paymentMode}</TableCell>
                  <TableCell>{payment.paymentDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleView(payment)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-green-500 hover:text-green-600"
                        onClick={() => handleConfirm(payment, 'approve')}
                        title="Approve Payment"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        onClick={() => handleConfirm(payment, 'reject')}
                        title="Reject Payment"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No pending payment requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Preview Dialog */}
      {selectedPayment && (
        <AlertDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Payment Request Details</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Student Name</p>
                      <p className="font-medium">{selectedPayment.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Admission No.</p>
                      <p className="font-medium">{selectedPayment.admissionNo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Class/Section</p>
                      <p className="font-medium">Class {selectedPayment.class} - {selectedPayment.section}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Term</p>
                      <p className="font-medium">{selectedPayment.term}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium">₹{selectedPayment.amount.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Mode</p>
                      <p className="font-medium">{selectedPayment.paymentMode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Date</p>
                      <p className="font-medium">{selectedPayment.paymentDate}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm mt-1">{selectedPayment.notes}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Screenshot/Receipt</p>
                    <img 
                      src={selectedPayment.screenshot} 
                      alt="Payment Receipt" 
                      className="w-full max-h-48 object-contain border rounded-md"
                    />
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-green-500 hover:bg-green-600"
                onClick={() => {
                  setIsPreviewOpen(false);
                  handleConfirm(selectedPayment, 'approve');
                }}
              >
                Approve
              </AlertDialogAction>
              <AlertDialogAction 
                className="bg-red-500 hover:bg-red-600"
                onClick={() => {
                  setIsPreviewOpen(false);
                  handleConfirm(selectedPayment, 'reject');
                }}
              >
                Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      {/* Confirmation Dialog */}
      {selectedPayment && (
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmAction === 'approve' ? 'Approve Payment?' : 'Reject Payment?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmAction === 'approve' 
                  ? `Are you sure you want to approve this payment of ₹${selectedPayment.amount} from ${selectedPayment.studentName}?`
                  : `Are you sure you want to reject this payment of ₹${selectedPayment.amount} from ${selectedPayment.studentName}?`
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className={confirmAction === 'approve' ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
                onClick={processAction}
              >
                {confirmAction === 'approve' ? 'Approve' : 'Reject'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default PendingPaymentsTable;
