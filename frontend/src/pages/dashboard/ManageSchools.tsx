"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import {
  School,
  getSchools,
  createSchool,
  updateSchool,
  deleteSchool,
} from "@/services/schools";
import ParseDate from "@/utils/parseDate";

function ManageSchools() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [deletingSchool, setDeletingSchool] = useState<School | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [formData, setFormData] = useState<
    Omit<School, "_id" | "createdAt" | "updatedAt">
  >({
    name: "",
    address: "",
    principalName: "",
    email: "",
    phone: "",
    type: "private",
    city: "",
    state: "",
    pinCode: "",
    establishedYear: new Date().getFullYear(),
  });

  const {
    data: schools = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["schools"],
    queryFn: getSchools,
  });

  const createMutation = useMutation({
    mutationFn: createSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School created successfully");
      handleCloseDialog();
    },
    onError: () => {
      toast.error("Failed to create school");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (school: School) => updateSchool(school._id!, school),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School updated successfully");
      handleCloseDialog();
    },
    onError: () => {
      toast.error("Failed to update school");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      toast.success("School deleted successfully");
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete school");
    },
  });

  const handleSubmit = async () => {
    if (editingSchool) {
      await updateMutation.mutateAsync({ ...editingSchool, ...formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  const handleEdit = (school: School) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      address: school.address,
      principalName: school.principalName,
      email: school.email,
      phone: school.phone,
      type: school.type,
      city: school.city,
      state: school.state,
      pinCode: school.pinCode,
      establishedYear: school.establishedYear,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingSchool?._id) return;
    await deleteMutation.mutateAsync(deletingSchool._id);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSchool(null);
    setFormData({
      name: "",
      address: "",
      principalName: "",
      email: "",
      phone: "",
      type: "private",
      city: "",
      state: "",
      pinCode: "",
      establishedYear: new Date().getFullYear(),
    });
  };

  const columns: ColumnDef<School>[] = [
    {
      accessorKey: "name",
      header: "School Name",
    },
    {
      accessorKey: "principalName",
      header: "Principal",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="capitalize">{row.original.type}</span>
      ),
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => ParseDate(row.original.createdAt || ""),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDeletingSchool(row.original);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: schools,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading schools</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schools</h1>
          <p className="text-muted-foreground">
            Manage schools in your organization
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New School
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No schools found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingSchool ? "Edit School" : "Add New School"}
            </DialogTitle>
            <DialogDescription>
              {editingSchool
                ? "Update the school information below"
                : "Fill in the details to add a new school"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">School Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">School Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "government" | "private") =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, state: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pinCode">PIN Code</Label>
                <Input
                  id="pinCode"
                  value={formData.pinCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pinCode: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="principalName">Principal Name</Label>
                <Input
                  id="principalName"
                  value={formData.principalName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      principalName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="establishedYear">Year Established</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      establishedYear: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {editingSchool ? "Update School" : "Add School"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              school "{deletingSchool?.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ManageSchools;
