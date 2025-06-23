// components/admin/admin-manage-roles-dialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { Role } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { AdminUser } from '@/components/hooks/users/get-users-by-admin';
import { updateUserRoles } from '@/components/hooks/users/update-users-by-admin';
import { Checkbox } from '@/components/ui/checkbox';

interface ManageRolesDialogProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// --- FIX: Define a specific type for API errors to avoid 'any' ---
interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const allRoles = Object.values(Role);

export const ManageRolesDialog = ({ user, isOpen, onClose, onSuccess }: ManageRolesDialogProps) => {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedRoles(user.roles);
    }
  }, [user]);

  const handleRoleChange = (role: Role, checked: boolean | 'indeterminate') => {
    setSelectedRoles(prev =>
      checked === true ? [...prev, role] : prev.filter(r => r !== role)
    );
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    setIsLoading(true);

    toast.promise(
      updateUserRoles(user._id, selectedRoles),
      {
        loading: 'Saving changes...',
        success: (updatedUser) => {
          onSuccess();
          onClose();
          return `Roles for ${updatedUser.firstName} updated successfully!`;
        },
        // --- FIX: Use the specific ApiError type ---
        error: (err: ApiError) => {
          return err.response?.data?.message || 'Failed to update roles.';
        },
        finally: () => {
          setIsLoading(false);
        }
      }
    );
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Roles for {user.firstName} {user.lastName}</DialogTitle>
          <DialogDescription>
            Select the roles to assign to this user. Be careful, as roles grant specific permissions. The &ldquo;Owner&rdquo; role cannot be changed from this panel.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 grid grid-cols-2 gap-4">
          {allRoles.map(role => (
            <div key={role} className="flex items-center space-x-2">
              <Checkbox
                id={`role-${role}`}
                checked={selectedRoles.includes(role)}
                onCheckedChange={(checked: boolean | 'indeterminate') => handleRoleChange(role, checked)}
                disabled={role === Role.Owner}
              />
              <Label htmlFor={`role-${role}`} className="capitalize">
                {role}
              </Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};