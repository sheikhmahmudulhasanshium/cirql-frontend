// components/admin/admin-manage-user-dialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { Role } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UserX, UserCheck } from 'lucide-react';
import { AdminUser } from '@/components/hooks/users/get-users-by-admin';
import { updateUserRoles, banUser, unbanUser } from '@/components/hooks/users/update-users-by-admin';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/components/contexts/AuthContext';
import { AxiosError } from 'axios';

interface ApiErrorData {
  message?: string | string[];
}

interface ManageUserDialogProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const allRoles = Object.values(Role).filter(r => r !== Role.Owner);

export const ManageUserDialog = ({ user, isOpen, onClose, onSuccess }: ManageUserDialogProps) => {
  const { state: { user: currentUser } } = useAuth();
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [banReason, setBanReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedRoles(user.roles);
      setBanReason('');
    }
  }, [user]);

  const getApiErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      const apiError = error.response?.data as ApiErrorData;
      if (apiError && apiError.message) {
        return Array.isArray(apiError.message) ? apiError.message.join(', ') : apiError.message;
      }
    }
    return 'An unexpected error occurred.';
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateUserRoles(user._id, selectedRoles);
      toast.success("User roles updated successfully.");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to update roles", { description: getApiErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!user || !banReason) return;
    setIsLoading(true);
    try {
      await banUser(user._id, banReason);
      toast.success("User has been banned.");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to ban user", { description: getApiErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnbanUser = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await unbanUser(user._id);
      toast.success("User has been unbanned.");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to unban user", { description: getApiErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !currentUser) return null;

  const canManage = user._id !== currentUser._id && !user.roles.includes(Role.Owner);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage {user.firstName} {user.lastName}</DialogTitle>
          <DialogDescription>Email: {user.email}</DialogDescription>
        </DialogHeader>

        {canManage ? (
          <>
            <div className="py-4 space-y-4">
              <div>
                <Label className="font-semibold">Roles</Label>
                <div className="py-2 grid grid-cols-2 gap-4">
                  {allRoles.map(role => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role}`}
                        checked={selectedRoles.includes(role)}
                        onCheckedChange={(checked) => setSelectedRoles(prev => checked ? [...prev, role] : prev.filter(r => r !== role))}
                      />
                      <Label htmlFor={`role-${role}`} className="capitalize">{role}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="font-semibold">Account Status</Label>
                <p className="text-sm text-muted-foreground mb-2">Current status: <span className="font-bold capitalize">{user.accountStatus}</span></p>
                {user.accountStatus === 'banned' ? (
                  <Button variant="outline" onClick={handleUnbanUser} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="mr-2 h-4 w-4" />}
                    Reactivate Account
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" disabled={isLoading} className="w-full">
                        <UserX className="mr-2 h-4 w-4" /> Ban Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to ban {user.firstName}?</DialogTitle>
                        <DialogDescription>
                          This action will immediately suspend their account. Please provide a clear reason, which will be logged and emailed to the user.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-2">
                        <Label htmlFor="ban-reason">Reason for Ban</Label>
                        <Textarea
                          id="ban-reason"
                          placeholder="Reason for suspension (min 10 characters)..."
                          value={banReason}
                          onChange={(e) => setBanReason(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={handleBanUser}
                          disabled={banReason.length < 10 || isLoading}
                        >
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirm Ban'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
              <Button onClick={handleSaveChanges} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Role Changes
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-4">
            <p className="text-center text-muted-foreground">You cannot manage this user account.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};