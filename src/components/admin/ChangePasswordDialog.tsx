"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAuthCredentials, updatePassword } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const ChangePasswordDialog = () => {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleChangePassword = () => {
    const auth = getAuthCredentials();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    if (currentPassword !== auth.password) {
      toast({
        title: "Current password is incorrect",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "New password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    updatePassword(newPassword);
    toast({ title: "Password changed successfully" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-body">
          <KeyRound className="w-4 h-4 mr-2" /> Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Change Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="currentPassword" className="font-body">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="font-body"
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="font-body">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
              className="font-body"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="font-body">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="font-body"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="font-body"
            >
              Cancel
            </Button>
            <Button onClick={handleChangePassword} className="font-body">
              Update Password
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
