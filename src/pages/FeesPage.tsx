
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Filter, Users, CreditCard, AlertCircle, CheckCircle, DollarSign } from "lucide-react";
import FeeTable from "@/components/fees/FeeTable";
import PendingPaymentsTable from "@/components/fees/PendingPaymentsTable";
import { useIsMobile } from '@/hooks/use-mobile';

const FeesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("fees");
  const [academicYear, setAcademicYear] = useState<string>("2024-2025");
  const [classFilter, setClassFilter] = useState<string>("");
  const [sectionFilter, setSectionFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentModeFilter, setPaymentModeFilter] = useState<string>("");
  const [currentTerm, setCurrentTerm] = useState<string>("Term 1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const isMobile = useIsMobile();

  // Mock summary statistics
  const summaryStats = {
    totalStudents: 157,
    studentsPaidThisTerm: 92,
    studentsPendingThisTerm: 65,
    fullYearPaidStudents: 43,
    totalFeeCollected: 4762500,
    outstandingBalance: 2137500,
  };

  return (
    <AppLayout title="Fees Management">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Fees Management</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Track fee payments, collect fees, and manage pending payment requests
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border shadow-sm">
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Term</span>
                <Select value={currentTerm} onValueChange={setCurrentTerm}>
                  <SelectTrigger className="w-[100px] h-7">
                    <SelectValue placeholder="Select Term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Term 1">Term 1</SelectItem>
                    <SelectItem value="Term 2">Term 2</SelectItem>
                    <SelectItem value="Term 3">Term 3</SelectItem>
                    <SelectItem value="Term 4">Term 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-4 flex flex-col">
              <span className="text-sm text-muted-foreground">Total Students</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-semibold">{summaryStats.totalStudents}</span>
                <Users className="text-gray-400 h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-4 flex flex-col">
              <span className="text-sm text-muted-foreground">Students Paid This Term</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-semibold">{summaryStats.studentsPaidThisTerm}</span>
                <CheckCircle className="text-green-500 h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-4 flex flex-col">
              <span className="text-sm text-muted-foreground">Students Pending This Term</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-semibold">{summaryStats.studentsPendingThisTerm}</span>
                <AlertCircle className="text-orange-500 h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-4 flex flex-col">
              <span className="text-sm text-muted-foreground">Full-Year Paid Students</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-semibold">{summaryStats.fullYearPaidStudents}</span>
                <CreditCard className="text-gray-400 h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardContent className="p-4 flex flex-col">
              <span className="text-sm text-muted-foreground">Total Fee Collected</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-semibold">₹{summaryStats.totalFeeCollected.toLocaleString('en-IN')}</span>
                <DollarSign className="text-green-500 h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm col-span-1 md:col-span-2">
            <CardContent className="p-4 flex flex-col">
              <span className="text-sm text-muted-foreground">Outstanding Balance</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-semibold">₹{summaryStats.outstandingBalance.toLocaleString('en-IN')}</span>
                <AlertCircle className="text-red-500 h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="fees" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="fees">Student Fees</TabsTrigger>
            <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fees" className="space-y-4">
            {/* Filters */}
            <div className="bg-card rounded-lg border shadow-sm p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Academic Year</label>
                    <Select value={academicYear} onValueChange={setAcademicYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Class</label>
                    <Select value={classFilter} onValueChange={setClassFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="1">Class 1</SelectItem>
                        <SelectItem value="2">Class 2</SelectItem>
                        <SelectItem value="3">Class 3</SelectItem>
                        <SelectItem value="10">Class 10</SelectItem>
                        <SelectItem value="11">Class 11</SelectItem>
                        <SelectItem value="12">Class 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Section</label>
                    <Select value={sectionFilter} onValueChange={setSectionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Section" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        <SelectItem value="A">Section A</SelectItem>
                        <SelectItem value="B">Section B</SelectItem>
                        <SelectItem value="C">Section C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Mode</label>
                    <Select value={paymentModeFilter} onValueChange={setPaymentModeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Modes</SelectItem>
                        <SelectItem value="term">Term-wise</SelectItem>
                        <SelectItem value="full">Full-Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-sm font-medium">Search</label>
                    <Input 
                      placeholder="Search by name or admission no" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex items-end space-x-2 lg:col-span-3">
                    <Button variant="outline" size="sm" className="h-10" onClick={() => {
                      setClassFilter("");
                      setSectionFilter("");
                      setStatusFilter("");
                      setPaymentModeFilter("");
                      setSearchQuery("");
                    }}>
                      Reset
                    </Button>
                    <Button size="sm" className="h-10">Apply Filters</Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Fee Table */}
            <FeeTable currentTerm={currentTerm} isMobile={isMobile} />
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            <PendingPaymentsTable />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default FeesPage;
