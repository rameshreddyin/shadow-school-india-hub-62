
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import SalaryPaymentDialog from '@/components/salary/SalaryPaymentDialog';
import SalaryHistoryTable from '@/components/salary/SalaryHistoryTable';
import StaffSalaryList from '@/components/salary/StaffSalaryList';
import { Input } from '@/components/ui/input';

const StaffSalaryPage = () => {
  const [activeTab, setActiveTab] = useState('staff');
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>(undefined);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = ['2023', '2024', '2025', '2026', '2027'];
  
  const departments = [
    'All Departments', 
    'Science', 
    'Mathematics', 
    'Languages', 
    'Social Studies', 
    'Administration', 
    'Finance', 
    'Security', 
    'Housekeeping'
  ];

  const handleRecordPayment = (staffId?: string) => {
    setSelectedStaffId(staffId);
    setIsPaymentDialogOpen(true);
  };

  return (
    <AppLayout title="Staff Salaries">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Staff Salary Management</h1>
            <p className="text-muted-foreground">Manage and track all staff salary payments</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={() => handleRecordPayment()}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Main tabs - removed overview and reports tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="staff">Staff Salaries</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[90px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Staff Salaries tab */}
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <CardTitle>Staff Salaries</CardTitle>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="relative w-full sm:w-auto">
                      <Input
                        placeholder="Search staff..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 w-full sm:w-[200px]"
                      />
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <CardDescription>
                  Manage staff salaries and record payments for {selectedMonth} {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StaffSalaryList
                  month={selectedMonth}
                  year={selectedYear}
                  searchQuery={searchQuery}
                  departmentFilter={departmentFilter}
                  onRecordPayment={handleRecordPayment}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* History tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View all salary payments made to staff members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalaryHistoryTable
                  month={selectedMonth}
                  year={selectedYear}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Payment Dialog */}
      <SalaryPaymentDialog 
        open={isPaymentDialogOpen} 
        onOpenChange={(open) => {
          setIsPaymentDialogOpen(open);
          if (!open) {
            setSelectedStaffId(undefined); // Clear selected staff when dialog closes
          }
        }}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        selectedStaffId={selectedStaffId}
      />
    </AppLayout>
  );
};

export default StaffSalaryPage;
