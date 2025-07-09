import { useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { StockSearch } from "@/components/stock-search";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertPortfolioSchema } from "@shared/schema";
import { z } from "zod";

const portfolioFormSchema = insertPortfolioSchema.extend({
  purchaseDate: z.string().min(1, "Purchase date is required"),
});

type PortfolioFormData = z.infer<typeof portfolioFormSchema>;

interface AddToPortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStock?: string;
}

export function AddToPortfolioDialog({ open, onOpenChange, defaultStock }: AddToPortfolioDialogProps) {
  const [selectedStock, setSelectedStock] = useState<string>(defaultStock || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      userId: "guest",
      stockSymbol: "",
      quantity: 1,
      buyPrice: "",
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  const addToPortfolioMutation = useMutation({
    mutationFn: async (data: PortfolioFormData) => {
      const portfolioData = {
        ...data,
        purchaseDate: new Date(data.purchaseDate),
      };
      await apiRequest("POST", "/api/portfolio", portfolioData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio/performance"] });
      toast({
        title: "Success",
        description: "Stock added to portfolio successfully",
      });
      onOpenChange(false);
      form.reset();
      setSelectedStock(defaultStock || "");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add stock to portfolio",
        variant: "destructive",
      });
    },
  });

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    form.setValue("stockSymbol", symbol);
  };

  // Set default stock when dialog opens
  React.useEffect(() => {
    if (defaultStock && open) {
      setSelectedStock(defaultStock);
      form.setValue("stockSymbol", defaultStock);
    }
  }, [defaultStock, open, form]);

  const onSubmit = (data: PortfolioFormData) => {
    addToPortfolioMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Add Stock to Portfolio
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Stock Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Stock</label>
              <StockSearch 
                onStockSelect={handleStockSelect}
                placeholder="Search for a stock..."
              />
              {selectedStock && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    Selected: <span className="font-semibold">{selectedStock}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buy Price */}
            <FormField
              control={form.control}
              name="buyPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buy Price</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="Enter purchase price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Purchase Date */}
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any notes about this investment..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!selectedStock || addToPortfolioMutation.isPending}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                {addToPortfolioMutation.isPending ? "Adding..." : "Add to Portfolio"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}