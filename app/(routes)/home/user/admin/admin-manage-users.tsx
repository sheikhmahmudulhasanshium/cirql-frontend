// components/admin/admin-manage-users.tsx
'use client';

import { useState, useMemo } from 'react';
import { Loader2, ServerCrash, Users, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminUser, useAdminUsers, UserFilters } from '@/components/hooks/users/get-users-by-admin';
import { ManageRolesDialog } from './admin-manage-roles-dialog';
import { useDebounce } from '@/components/hooks/use-debounce';
import { Badge } from '@/components/ui/badge';

export default function ManageUsers() {
  // --- FIX: Replaced useState with a constant since setPage was unused ---
  const page = 1;
  const [filters, setFilters] = useState<UserFilters>({});
  
  const debouncedSearch = useDebounce(filters.search, 500);

  const stableFilters = useMemo(() => ({
    accountStatus: filters.accountStatus,
    search: debouncedSearch,
  }), [filters.accountStatus, debouncedSearch]);

  // --- FIX: Removed unused 'pagination' from destructuring ---
  const { users, isLoading, error, refetch } = useAdminUsers(page, 10, stableFilters);
  
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleManageClick = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const renderContent = () => {
    if (isLoading && users.length === 0) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-10 bg-destructive/10 border border-destructive rounded-lg">
          <ServerCrash className="w-8 h-8 text-destructive" />
          <p className="mt-4 font-semibold text-destructive">{error.message}</p>
        </div>
      );
    }

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg bg-card mt-4">
                <Users className="w-12 h-12 text-muted-foreground" />
                <h2 className="mt-6 text-xl font-semibold">No Users Found</h2>
                <p className="mt-2 text-muted-foreground">No users match the current filter criteria.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 mt-4">
        {users.map((user) => (
          <div key={user._id} className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex flex-wrap gap-1 justify-start sm:justify-end flex-grow">
                {user.roles.map(role => (
                  <Badge key={role} variant="secondary" className="capitalize">{role}</Badge>
                ))}
              </div>
              <Button size="sm" onClick={() => handleManageClick(user)} className="w-full sm:w-auto">
                <UserCog className="mr-2 h-4 w-4" />
                Manage Roles
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
                placeholder="Search by name or email..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
            <Select
                value={filters.accountStatus || 'all'}
                onValueChange={(value) => setFilters(prev => ({ ...prev, accountStatus: value === 'all' ? undefined : value }))}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Filter by status..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {renderContent()}
      
      <ManageRolesDialog
        user={selectedUser}
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSuccess={refetch}
      />
    </>
  );
}