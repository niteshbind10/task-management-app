import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FiAlertTriangle } from "react-icons/fi";

interface DeleteConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm select-none animate-fadeIn">
      <Card className="w-full max-w-md border border-border shadow-2xl bg-card">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 shrink-0">
            <FiAlertTriangle size={20} />
          </div>
          <CardTitle className="text-base font-bold text-foreground">Confirm Delete Operation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Are you sure you want to permanently delete this task? This action is irreversible and the task details will be lost forever.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete Task"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteConfirm;
