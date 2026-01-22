"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit } from "lucide-react";
import { toast } from "sonner";
import { Product } from "@/lib/types";

export default function ProductsPage() {
    const { products, updateProduct, setProducts } = useStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        tags: "",
        capabilities: "",
    });

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                category: product.category,
                tags: product.tags.join(", "),
                capabilities: product.capabilities.join(", "),
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: "", category: "", tags: "", capabilities: "" });
        }
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.category) {
            toast.error("Please fill in required fields");
            return;
        }

        const productData = {
            name: formData.name,
            category: formData.category,
            tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            capabilities: formData.capabilities.split(",").map((c) => c.trim()).filter(Boolean),
        };

        if (editingProduct) {
            updateProduct(editingProduct.product_id, productData);
            toast.success("Product updated");
        } else {
            const newProduct: Product = {
                product_id: `prod-${Date.now()}`,
                ...productData,
                active: true,
            };
            setProducts([...products, newProduct]);
            toast.success("Product added");
        }

        setIsDialogOpen(false);
    };

    return (
        <div className="flex flex-col">
            <PageHeader
                title="Product Settings"
                description="Manage LG product lineup and activation"
                actions={
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => handleOpenDialog()} className="bg-[#A50034]">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Product Name *</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="LG Styler"
                                    />
                                </div>
                                <div>
                                    <Label>Category *</Label>
                                    <Input
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="Home Appliance"
                                    />
                                </div>
                                <div>
                                    <Label>Tags (comma-separated)</Label>
                                    <Input
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="#가전_세탁, #털제거, #의류관리"
                                    />
                                </div>
                                <div>
                                    <Label>Capabilities (comma-separated)</Label>
                                    <Textarea
                                        value={formData.capabilities}
                                        onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
                                        placeholder="Steam refresh, Pet hair removal, Odor elimination"
                                    />
                                </div>
                                <Button onClick={handleSave} className="w-full">
                                    {editingProduct ? "Update" : "Add"} Product
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                }
            />

            <div className="p-8">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-16">Active</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Capabilities</TableHead>
                                <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.product_id}>
                                    <TableCell>
                                        <Switch
                                            checked={product.active}
                                            onCheckedChange={(checked) =>
                                                updateProduct(product.product_id, { active: checked })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {product.tags.slice(0, 3).map((tag, i) => (
                                                <Badge key={i} variant="secondary" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {product.tags.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{product.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {product.capabilities.slice(0, 2).join(", ")}
                                        {product.capabilities.length > 2 && "..."}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleOpenDialog(product)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
