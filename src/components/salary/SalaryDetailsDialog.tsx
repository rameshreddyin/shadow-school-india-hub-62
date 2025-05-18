
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, CheckCircle, DollarSign, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SalaryPayment {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  amount: number;
  date: string;
  month: string;
  year: number;
  paymentMethod: string;
  reference: string;
  deductions?: number;
  bonuses?: number;
  notes?: string;
}

interface SalaryDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: SalaryPayment | null;
}

const SalaryDetailsDialog: React.FC<SalaryDetailsDialogProps> = ({
  open,
  onOpenChange,
  payment,
}) => {
  const isMobile = useIsMobile();

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

  if (!payment) return null;

  // Calculate net amount
  const netAmount = () => {
    const deductions = payment.deductions || 0;
    const bonuses = payment.bonuses || 0;
    return payment.amount - deductions + bonuses;
  };

  const Content = () => (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{payment.staffName}</h3>
            <p className="text-sm text-muted-foreground">{payment.staffId} • {payment.department}</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-lg font-bold">₹{payment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Amount</p>
                <p className="text-lg font-bold">₹{netAmount().toLocaleString()}</p>
              </div>
              {payment.deductions && payment.deductions > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Deductions</p>
                  <p className="text-md">₹{payment.deductions.toLocaleString()}</p>
                </div>
              )}
              {payment.bonuses && payment.bonuses > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Bonuses</p>
                  <p className="text-md">₹{payment.bonuses.toLocaleString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div>
          <h4 className="text-sm font-medium mb-2">Payment Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Date</span>
              <span>{new Date(payment.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Period</span>
              <span>{payment.month} {payment.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span>{formatPaymentMethod(payment.paymentMethod)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference Number</span>
              <span className="font-mono">{payment.reference}</span>
            </div>
            {payment.notes && (
              <>
                <Separator className="my-2" />
                <div>
                  <span className="text-muted-foreground block mb-1">Notes</span>
                  <p className="text-sm">{payment.notes}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <CalendarIcon className="h-4 w-4 mr-2" />
            View History
          </Button>
          <Button className="w-full sm:w-auto">
            <FileDown className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>
    </>
  );

  // Use Sheet on mobile and Dialog on desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col h-[85vh] w-full">
          <SheetHeader className="text-left">
            <SheetTitle>Salary Payment Details</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-auto py-4">
            <Content />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Salary Payment Details</DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
};

export default SalaryDetailsDialog;
