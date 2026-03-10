import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  Dumbbell,
  Loader2,
  Pencil,
  Phone,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  Category,
  useAddMenuItem,
  useDeleteMenuItem,
  useGetAllMenuItems,
  useIsCallerAdmin,
  useSeedSampleItems,
  useUpdateMenuItem,
} from "../hooks/useQueries";
import type { MenuItem, MenuItemWithId } from "../hooks/useQueries";

interface AdminPageProps {
  navigate: (path: string) => void;
}

const CATEGORY_OPTIONS = [
  {
    value: Category.monthlyFood,
    label: "Monthly Food",
    icon: <CalendarDays className="w-4 h-4" />,
  },
  {
    value: Category.specialPerKg,
    label: "Special / Per Kg Menu",
    icon: <ChefHat className="w-4 h-4" />,
  },
  {
    value: Category.gymProtein,
    label: "Gym & Protein Menu",
    icon: <Dumbbell className="w-4 h-4" />,
  },
];

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.monthlyFood]: "Monthly Food",
  [Category.specialPerKg]: "Special / Per Kg",
  [Category.gymProtein]: "Gym & Protein",
};

const CATEGORY_COLORS: Record<Category, string> = {
  [Category.monthlyFood]: "bg-primary/10 text-primary border-primary/20",
  [Category.specialPerKg]: "bg-orange-100 text-orange-700 border-orange-200",
  [Category.gymProtein]: "bg-green-100 text-green-700 border-green-200",
};

interface FormData {
  name: string;
  description: string;
  price: string;
  category: Category;
  available: boolean;
}

const EMPTY_FORM: FormData = {
  name: "",
  description: "",
  price: "",
  category: Category.monthlyFood,
  available: true,
};

function LoginPrompt() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-card rounded-3xl border border-border shadow-card">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground text-sm">
            Please login with Internet Identity to access the admin panel for
            Rana's Food Fantasy.
          </p>
        </div>
        <Button
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 rounded-full font-semibold"
          onClick={() => login()}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login to Continue"
          )}
        </Button>
      </div>
    </div>
  );
}

function AccessDenied({ navigate }: { navigate: (path: string) => void }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-card rounded-3xl border border-border shadow-card">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8 text-destructive" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">
            Access Denied
          </h1>
          <p className="text-muted-foreground text-sm">
            You don't have admin privileges. Please contact the administrator.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}

export default function AdminPage({ navigate }: AdminPageProps) {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const {
    data: menuItems,
    isLoading: menuLoading,
    isError: menuError,
  } = useGetAllMenuItems();

  const addMutation = useAddMenuItem();
  const updateMutation = useUpdateMenuItem();
  const deleteMutation = useDeleteMenuItem();
  const seedMutation = useSeedSampleItems();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  // Loading state while checking auth
  if (!isAuthenticated) return <LoginPrompt />;

  if (adminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return <AccessDenied navigate={navigate} />;

  // Form validation
  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      setFormError("Item name is required");
      return false;
    }
    if (
      !form.price.trim() ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      setFormError("Please enter a valid price");
      return false;
    }
    return true;
  };

  const openAddForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
    setIsFormOpen(true);
  };

  const openEditForm = (item: MenuItemWithId) => {
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      available: item.available,
    });
    setEditingId(item.id);
    setFormError("");
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const menuItem: MenuItem = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: BigInt(Math.round(Number(form.price))),
      category: form.category,
      available: form.available,
    };

    try {
      if (editingId !== null) {
        await updateMutation.mutateAsync({
          id: editingId,
          menuItem,
        });
        toast.success("Menu item updated!");
      } else {
        await addMutation.mutateAsync(menuItem);
        toast.success("Menu item added!");
      }
      setIsFormOpen(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setFormError(msg);
      toast.error("Failed to save item");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Item deleted");
    } catch {
      toast.error("Failed to delete item");
    }
  };

  const handleSeed = async () => {
    try {
      await seedMutation.mutateAsync();
      toast.success("Sample items seeded successfully!");
    } catch {
      toast.error("Failed to seed items");
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate("/");
  };

  const isSaving = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-foreground border-b border-white/10 shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => navigate("/")}
              data-ocid="nav.home_link"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Back to Site</span>
            </Button>
            <div className="h-5 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <img
                src="/assets/uploads/IMG-20260221-WA0013-1.jpg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/assets/IMG-20260221-WA0013-1.jpg";
                }}
                alt="Logo"
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="font-display font-semibold text-white text-sm">
                Admin Panel
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:8906465554"
              className="hidden sm:flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>8906465554</span>
            </a>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Page Title + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Menu Management
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Add, edit, or remove items from the Rana's Food Fantasy menu
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-primary/30 text-primary hover:bg-primary/10"
              onClick={handleSeed}
              disabled={seedMutation.isPending}
              data-ocid="admin.seed_button"
            >
              {seedMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {seedMutation.isPending ? "Seeding..." : "Seed Sample Items"}
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-warm"
              onClick={openAddForm}
              data-ocid="admin.add_button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Error State */}
        {menuError && (
          <Alert
            variant="destructive"
            className="mb-6"
            data-ocid="admin.error_state"
          >
            <AlertDescription>
              Failed to load menu items. Please refresh and try again.
            </AlertDescription>
          </Alert>
        )}

        {/* Success State */}
        {(addMutation.isSuccess ||
          updateMutation.isSuccess ||
          seedMutation.isSuccess) && (
          <div
            className="mb-6 flex items-center gap-2 p-4 bg-accent/10 border border-accent/20 rounded-xl text-accent"
            data-ocid="admin.success_state"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">
              Changes saved successfully!
            </span>
          </div>
        )}

        {/* Loading State */}
        {menuLoading && (
          <div className="space-y-4" data-ocid="admin.loading_state">
            {Array.from({ length: 5 }, (_, i) => `admin-skel-${i}`).map(
              (id) => (
                <div
                  key={id}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
                >
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ),
            )}
          </div>
        )}

        {/* Empty State */}
        {!menuLoading && (!menuItems || menuItems.length === 0) && (
          <div
            className="text-center py-20 text-muted-foreground bg-card rounded-3xl border border-border"
            data-ocid="admin.empty_state"
          >
            <div className="text-5xl mb-4">🍽️</div>
            <p className="font-display text-xl font-semibold text-foreground mb-2">
              No Menu Items Yet
            </p>
            <p className="text-sm mb-6 max-w-xs mx-auto">
              Get started by seeding sample items or adding your first menu
              item.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={handleSeed}
                disabled={seedMutation.isPending}
                data-ocid="admin.seed_button"
              >
                {seedMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Seed Sample Items
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={openAddForm}
                data-ocid="admin.add_button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            </div>
          </div>
        )}

        {/* Menu Items Table */}
        {!menuLoading && menuItems && menuItems.length > 0 && (
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-4 font-semibold text-muted-foreground">
                      #
                    </th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">
                      Name
                    </th>
                    <th className="text-left p-4 font-semibold text-muted-foreground hidden md:table-cell">
                      Description
                    </th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">
                      Category
                    </th>
                    <th className="text-left p-4 font-semibold text-muted-foreground">
                      Price
                    </th>
                    <th className="text-left p-4 font-semibold text-muted-foreground hidden sm:table-cell">
                      Available
                    </th>
                    <th className="text-right p-4 font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item, idx) => (
                    <tr
                      key={`${item.name}-${item.category}`}
                      data-ocid={`admin.item.${idx + 1}`}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 text-muted-foreground font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="p-4 font-semibold text-foreground">
                        {item.name}
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell max-w-xs">
                        <span className="line-clamp-2 text-xs">
                          {item.description || "—"}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={`text-xs ${CATEGORY_COLORS[item.category] ?? "bg-muted"}`}
                        >
                          {CATEGORY_LABELS[item.category] ?? item.category}
                        </Badge>
                      </td>
                      <td className="p-4 font-bold text-primary">
                        ₹{item.price.toString()}
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
                            item.available
                              ? "bg-green-100 text-green-700"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${item.available ? "bg-green-500" : "bg-muted-foreground"}`}
                          />
                          {item.available ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                            onClick={() => openEditForm(item)}
                            data-ocid={`admin.edit_button.${idx + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                data-ocid={`admin.delete_button.${idx + 1}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent data-ocid="admin.dialog">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Menu Item
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <strong>"{item.name}"</strong>? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-ocid="admin.cancel_button">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                  onClick={() => handleDelete(item.id)}
                                  data-ocid="admin.confirm_button"
                                >
                                  {deleteMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    "Delete"
                                  )}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ─── Add / Edit Dialog ─────────────────────────────── */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin.modal">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingId !== null ? "Edit Menu Item" : "Add New Menu Item"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="item-name">Item Name *</Label>
              <Input
                id="item-name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Dal Makhani"
                data-ocid="admin.input"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="item-desc">Description</Label>
              <Textarea
                id="item-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Brief description of the item..."
                rows={3}
                data-ocid="admin.textarea"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="item-price">Price (₹) *</Label>
              <Input
                id="item-price"
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: e.target.value }))
                }
                placeholder="e.g. 150"
                min={0}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="item-category">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(val) =>
                  setForm((p) => ({ ...p, category: val as Category }))
                }
              >
                <SelectTrigger data-ocid="admin.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map(({ value, label, icon }) => (
                    <SelectItem key={value} value={value}>
                      <span className="flex items-center gap-2">
                        {icon}
                        {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Available Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
              <div>
                <Label htmlFor="item-available" className="font-medium">
                  Available
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Toggle to show/hide this item on the menu
                </p>
              </div>
              <Switch
                id="item-available"
                checked={form.available}
                onCheckedChange={(val) =>
                  setForm((p) => ({ ...p, available: val }))
                }
                data-ocid="admin.toggle"
              />
            </div>

            {/* Form Error */}
            {formError && (
              <Alert variant="destructive" data-ocid="admin.error_state">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsFormOpen(false);
                setFormError("");
              }}
              disabled={isSaving}
              data-ocid="admin.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSubmit}
              disabled={isSaving}
              data-ocid="admin.save_button"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingId !== null ? (
                "Save Changes"
              ) : (
                "Add Item"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4 max-w-7xl text-center text-xs text-muted-foreground">
          <p>
            Rana's Food Fantasy — Admin Panel | FSSAI Reg. No.: 22826080000159
          </p>
        </div>
      </footer>
    </div>
  );
}
