import { Edit2Icon, Trash2Icon } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from 'react-hot-toast';

const FieldEdit = ({ defaultValue, onUpdate, onDelete }) => {
  const [placeholder, setPlaceholder] = useState("");
  const [label, setLabel] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setPlaceholder(defaultValue.placeholder || "");
      setLabel(defaultValue.fieldLabel || "");
    }
  }, [defaultValue]);

  const handleUpdate = () => {
    if (label.trim() === "" || placeholder.trim() === "") {
      toast.error("Label and Placeholder cannot be empty");
      return;
    }
    onUpdate({
      label: label,
      placeholder: placeholder,
    });
    toast.success("Field updated successfully");
  };

  const handleDelete = () => {
    onDelete();
    setIsDeleteDialogOpen(false);
    toast.success("Field deleted successfully");
  };

  return (
    <div className="flex items-center gap-2 text-dark-blue hover:cursor-pointer w-auto">
      <Dialog>
        <DialogTrigger asChild>
          <Edit2Icon className="h-4 w-4 text-green-600" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit field</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <Label className="text-slate-600">Label name</Label>
            <Input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Label className="text-slate-600">Placeholder name</Label>
            <Input
              type="text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />
          </div>
          <Button onClick={handleUpdate} className="mr-2">
            Update
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Trash2Icon className="h-4 w-4 text-red-600" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete?</DialogTitle>
          </DialogHeader>
          <Button onClick={handleDelete} className="mr-2">
            Delete
          </Button>
          <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
      <Toaster position="top-right" />
    </div>
  );
};

export default FieldEdit;
