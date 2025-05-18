
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';

interface SalaryStatisticsProps {
  month: string;
  year: string;
}

// Mock statistics data
const getStatistics = (month: string, year: string) => {
  // In a real app, you would fetch this data from an API
  return {
    totalBudget: 192000,
    totalPaid: 115000,
    totalPending: 77000,
    totalStaff: 5,
    paidStaff: 3,
    pendingStaff: 2,
    averageSalary: 38400,
    highestSalary: 45000,
    lowestSalary: 32000,
    previousMonthTotal: 190000,
    percentChange: 1.05,
  };
};

const SalaryStatistics: React.FC<SalaryStatisticsProps> = ({ month, year }) => {
  const stats = getStatistics(month, year);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Salary Budget
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{stats.totalBudget.toLocaleString()}</div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {month} {year}
            </p>
            <p className="text-xs text-green-600">
              +{stats.percentChange}% from last month
            </p>
          </div>
          <div className="mt-4 h-1 w-full bg-muted overflow-hidden rounded-full">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${(stats.totalPaid / stats.totalBudget) * 100}%` }} 
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <div>Paid: ₹{stats.totalPaid.toLocaleString()} ({Math.round((stats.totalPaid / stats.totalBudget) * 100)}%)</div>
            <div>Pending: ₹{stats.totalPending.toLocaleString()}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Staff Payment Status
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStaff} Staff Members</div>
          <p className="text-xs text-muted-foreground">
            Total number of staff on payroll
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-muted p-2">
              <div className="text-center text-sm font-medium">Paid</div>
              <div className="text-center text-xl font-bold text-green-600">{stats.paidStaff}</div>
            </div>
            <div className="rounded-lg bg-muted p-2">
              <div className="text-center text-sm font-medium">Pending</div>
              <div className="text-center text-xl font-bold text-amber-600">{stats.pendingStaff}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Average Salary
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{stats.averageSalary.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            Average monthly salary per staff
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Highest:</span>
              <span className="text-xs font-medium">₹{stats.highestSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground">Lowest:</span>
              <span className="text-xs font-medium">₹{stats.lowestSalary.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Payment Timeline
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{month} {year}</div>
          <p className="text-xs text-muted-foreground">
            Current payment period
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-green-500"></div>
              <span className="text-xs">Completed: 3 payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-amber-500"></div>
              <span className="text-xs">Pending: 2 payments</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Last payment: {new Date('2025-05-21').toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalaryStatistics;
