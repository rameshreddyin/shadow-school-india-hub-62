
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Key, Lock, Search, UserPlus, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface User {
  id: number;
  name: string;
  role: string;
  linkedTo: string;
  linkedId: string;
  email: string;
  phone: string;
  username: string;
  status: 'active' | 'inactive';
}

const mockUsers: User[] = [
  { 
    id: 1, 
    name: 'Rajesh Sharma', 
    role: 'admin', 
    linkedTo: 'staff', 
    linkedId: 'STAFF-001', 
    email: 'rajesh@school.edu', 
    phone: '+91 98765 43210', 
    username: 'rajesh.admin', 
    status: 'active' 
  },
  { 
    id: 2, 
    name: 'Priya Patel', 
    role: 'teacher', 
    linkedTo: 'staff', 
    linkedId: 'STAFF-012', 
    email: 'priya@school.edu', 
    phone: '+91 98765 12345', 
    username: 'priya.teacher', 
    status: 'active' 
  },
  { 
    id: 3, 
    name: 'Vikram Singh', 
    role: 'accountant', 
    linkedTo: 'staff', 
    linkedId: 'STAFF-025', 
    email: 'vikram@school.edu', 
    phone: '+91 98765 54321', 
    username: 'vikram.accountant', 
    status: 'active' 
  },
  { 
    id: 4, 
    name: 'Amit Kumar', 
    role: 'student', 
    linkedTo: 'student', 
    linkedId: 'STU-2024-042', 
    email: 'amit@student.edu', 
    phone: '+91 87654 32109', 
    username: 'amit.student', 
    status: 'inactive' 
  }
];

const UserLoginSettings: React.FC = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState<string>("loginList");
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form state for new user creation
  const [newUser, setNewUser] = useState({
    role: '',
    linkedTo: '',
    linkedId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const handleCreateUser = () => {
    // Validate form
    if (!newUser.role || !newUser.linkedTo || !newUser.email || !newUser.password) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would save the data to the server
    console.log("Creating new user:", newUser);
    
    toast({
      title: "User Created",
      description: "New user login has been created successfully.",
    });
    
    // Reset form and switch to login list tab
    setNewUser({
      role: '',
      linkedTo: '',
      linkedId: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    
    setCurrentTab("loginList");
  };
  
  const handleResetPassword = () => {
    if (!selectedUser) return;
    
    // In a real app, we would call an API to reset the password
    toast({
      title: "Password Reset",
      description: `A password reset link has been sent to ${selectedUser.email}`,
    });
    
    setIsResetDialogOpen(false);
  };
  
  const handleToggleStatus = (userId: number) => {
    setUsers(prevUsers => prevUsers.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
    
    const targetUser = users.find(user => user.id === userId);
    const newStatus = targetUser?.status === 'active' ? 'inactive' : 'active';
    
    toast({
      title: `User ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
      description: `${targetUser?.name}'s account has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.`,
    });
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="loginList">User Logins</TabsTrigger>
          <TabsTrigger value="createLogin">Create Login</TabsTrigger>
        </TabsList>
        
        <TabsContent value="loginList">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setCurrentTab("createLogin")}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Linked To</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div>{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                          <div className="text-sm capitalize">{user.linkedTo}</div>
                          <div className="text-xs text-muted-foreground">{user.linkedId}</div>
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${
                              user.status === 'active' 
                                ? 'border-green-500 text-green-600 bg-green-50' 
                                : 'border-gray-300 text-gray-500 bg-gray-50'
                            }`}
                          >
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Dialog open={isResetDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => !open && setSelectedUser(null)}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsResetDialogOpen(true);
                                  }}
                                >
                                  <Key className="h-4 w-4 mr-1" />
                                  Reset
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reset Password</DialogTitle>
                                  <DialogDescription>
                                    This will send a password reset link to the user's email address.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                  <p>Are you sure you want to reset the password for:</p>
                                  <p className="font-medium mt-2">{selectedUser?.name}</p>
                                  <p className="text-muted-foreground">{selectedUser?.email}</p>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleResetPassword}>
                                    <Key className="mr-2 h-4 w-4" />
                                    Send Reset Link
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            
                            <Switch
                              checked={user.status === 'active'}
                              onCheckedChange={() => handleToggleStatus(user.id)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        {searchQuery ? (
                          <div>
                            <p>No users found matching "{searchQuery}"</p>
                            <Button
                              variant="ghost"
                              className="mt-2"
                              onClick={() => setSearchQuery("")}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Clear search
                            </Button>
                          </div>
                        ) : (
                          <p>No users found</p>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="createLogin">
          <div className="space-y-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="text-lg font-medium">Create New User Login</h3>
            <p className="text-sm text-muted-foreground">
              Create login credentials for staff members, students, or parents. Each login must be linked to an existing user record.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger id="user-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="accountant">Accountant</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linked-to">Linked To</Label>
                  <Select
                    value={newUser.linkedTo}
                    onValueChange={(value) => setNewUser({ ...newUser, linkedTo: value })}
                  >
                    <SelectTrigger id="linked-to">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff Member</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linked-id">Linked ID</Label>
                  <Input
                    id="linked-id"
                    placeholder="Enter staff ID or student ID"
                    value={newUser.linkedId}
                    onChange={(e) => setNewUser({ ...newUser, linkedId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the ID of the staff member or student
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setCurrentTab("loginList")}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>
                <Lock className="mr-2 h-4 w-4" />
                Create Login
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserLoginSettings;
