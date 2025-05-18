
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, DollarSign, FileText, Calendar, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SalaryPaymentDialog from '@/components/salary/SalaryPaymentDialog';
import SalaryHistoryTable from '@/components/salary/SalaryHistoryTable';
import StaffSalaryList from '@/components/salary/StaffSalaryList';
import SalaryStatistics from '@/components/salary/SalaryStatistics';
import { Input } from '@/components/ui/input';

const StaffSalaryPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');

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
              onClick={() => setIsPaymentDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Record Payment
            </Button>
          </div>
        </div>

        {/* Main tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staff">Staff Salaries</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
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
          
          {/* Overview tab */}
          <TabsContent value="overview" className="space-y-4">
            <SalaryStatistics month={selectedMonth} year={selectedYear} />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge>21 May</Badge>
                        <span>Rahul Sharma</span>
                      </div>
                      <span className="font-medium">₹45,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge>20 May</Badge>
                        <span>Priya Patel</span>
                      </div>
                      <span className="font-medium">₹38,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge>20 May</Badge>
                        <span>Anil Kumar</span>
                      </div>
                      <span className="font-medium">₹32,000</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveTab('history')}>
                    View All Payments
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Meena Singh</span>
                      <span className="font-medium text-amber-600">₹35,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ravi Desai</span>
                      <span className="font-medium text-amber-600">₹42,000</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('staff')}>
                    Process Payments
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Staff</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="font-medium">₹192,000</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('reports')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Staff tab */}
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
                      <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
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
                  onRecordPayment={() => setIsPaymentDialogOpen(true)}
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
          
          {/* Reports tab */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Salary Reports</CardTitle>
                <CardDescription>
                  Generate and download reports on staff salary payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="hover:bg-muted/50 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Overview of all salary payments for the selected month
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="hover:bg-muted/50 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Department Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Salary breakdown by department for budgeting
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="hover:bg-muted/50 cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-lg">Annual Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Complete yearly report of all salary payments
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Payment Dialog */}
      <SalaryPaymentDialog 
        open={isPaymentDialogOpen} 
        onOpenChange={setIsPaymentDialogOpen}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />
    </AppLayout>
  );
};

export default StaffSalaryPage;
