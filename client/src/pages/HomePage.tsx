import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import SummaryCards from "@/components/SummaryCards";
import LaborTable from "@/components/LaborTable";
import AddLaborDialog from "@/components/AddLaborDialog";
import AddDutyDialog from "@/components/AddDutyDialog";
import AddAdvanceDialog from "@/components/AddAdvanceDialog";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";
import { useToast } from "@/hooks/use-toast";
import { previewLaborPDF, downloadLaborPDF } from "@/lib/pdfGenerator";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface Labor {
  id: string;
  name: string;
  dailyRate: number;
  photo?: string;
  address?: string;
  totalDaily: number;
  totalDuty: number;
  totalAdvance: number;
  dutyEntries: Array<{ id?: string; date: string; daily: number; amount: number }>;
  advanceEntries: Array<{ id?: string; date: string; amount: number }>;
}

export default function HomePage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: laborers = [], isLoading } = useQuery<Labor[]>({
    queryKey: ['/api/laborers/complete'],
  });

  const addLaborMutation = useMutation({
    mutationFn: async (data: { name: string; dailyRate: number; photo?: string; address?: string }) => {
      return apiRequest('POST', '/api/laborers', data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/laborers/complete'] });
      toast({
        title: "Labor Added",
        description: `${variables.name} has been added successfully.`,
      });
    },
  });

  const addDutyMutation = useMutation({
    mutationFn: async (data: { laborerId: string; daily: number; date: string }) => {
      const labor = laborers.find(l => l.id === data.laborerId);
      const amount = labor ? labor.dailyRate * data.daily : 0;
      return apiRequest('POST', '/api/duty-entries', {
        laborerId: data.laborerId,
        daily: data.daily,
        date: data.date,
        amount: amount,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/laborers/complete'] });
      const labor = laborers.find(l => l.id === variables.laborerId);
      toast({
        title: "Duty Added",
        description: `${variables.daily} daily duty for ${labor?.name} on ${new Date(variables.date).toLocaleDateString()}`,
      });
    },
  });

  const addAdvanceMutation = useMutation({
    mutationFn: async (data: { laborerId: string; amount: number; date: string }) => {
      return apiRequest('POST', '/api/advance-entries', data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/laborers/complete'] });
      const labor = laborers.find(l => l.id === variables.laborerId);
      toast({
        title: "Advance Added",
        description: `₹${variables.amount.toLocaleString()} advance given to ${labor?.name} on ${new Date(variables.date).toLocaleDateString()}`,
      });
    },
  });

  const editLaborMutation = useMutation({
    mutationFn: async (data: { id: string; name: string; dailyRate: number; photo?: string; address?: string }) => {
      const { id, ...updateData } = data;
      
      // Update the laborer
      await apiRequest('PATCH', `/api/laborers/${id}`, updateData);

      // Get the laborer's duty entries and update their amounts
      const labor = laborers.find(l => l.id === id);
      if (labor && labor.dutyEntries.length > 0) {
        await Promise.all(
          labor.dutyEntries.map(entry =>
            apiRequest('PATCH', `/api/duty-entries/${entry.id}`, {
              amount: entry.daily * data.dailyRate,
            })
          )
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/laborers/complete'] });
      toast({
        title: "Labor Updated",
        description: `${variables.name} details have been updated successfully. All amounts recalculated.`,
      });
    },
  });

  const deleteLaborMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/laborers/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['/api/laborers/complete'] });
      const labor = laborers.find(l => l.id === id);
      toast({
        title: "Labor Deleted",
        description: `${labor?.name} has been removed successfully.`,
        variant: "destructive",
      });
    },
  });

  const handleAddLabor = (name: string, dailyRate: number, photo?: string, address?: string) => {
    addLaborMutation.mutate({ name, dailyRate, photo, address });
  };

  const handleAddDuty = (laborerId: string, daily: number, date: string) => {
    addDutyMutation.mutate({ laborerId, daily, date });
  };

  const handleAddAdvance = (laborerId: string, amount: number, date: string) => {
    addAdvanceMutation.mutate({ laborerId, amount, date });
  };

  const handleEditLabor = (id: string, name: string, dailyRate: number, photo?: string, address?: string) => {
    editLaborMutation.mutate({ id, name, dailyRate, photo, address });
  };

  const handleDeleteLabor = (id: string) => {
    deleteLaborMutation.mutate(id);
  };

  const handlePdfPreview = (labor: any) => {
    previewLaborPDF(labor);
    toast({
      title: "PDF Preview",
      description: `Opening PDF report for ${labor.name}`,
    });
  };

  const handlePdfDownload = (labor: any) => {
    downloadLaborPDF(labor);
    toast({
      title: "PDF Downloaded",
      description: `Report for ${labor.name} has been downloaded`,
    });
  };

  const filteredLaborers = useMemo(() => {
    if (!searchQuery.trim()) return laborers;
    return laborers.filter(labor =>
      labor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [laborers, searchQuery]);

  const totalLaborers = laborers.length;
  const totalDuty = laborers.reduce((sum, labor) => sum + (labor.totalDaily * labor.dailyRate), 0);
  const totalAdvance = laborers.reduce((sum, labor) => sum + labor.totalAdvance, 0);
  const netPayable = totalDuty - totalAdvance;

  const laborTableData = filteredLaborers.map(labor => ({
    id: labor.id,
    name: labor.name,
    photo: labor.photo,
    address: labor.address,
    totalDaily: labor.totalDaily,
    totalDuty: labor.totalDuty,
    totalAdvance: labor.totalAdvance,
    netPayable: (labor.totalDaily * labor.dailyRate) - labor.totalAdvance,
    dutyEntries: labor.dutyEntries,
    advanceEntries: labor.advanceEntries,
    dailyRate: labor.dailyRate,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Labor Management</h1>
              <p className="text-sm text-muted-foreground mt-1">Track duties, advances, and payments efficiently</p>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="w-full sm:max-w-md h-10 bg-muted rounded-lg animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-6 w-32 bg-muted rounded animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-muted rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-6 w-40 bg-muted rounded animate-pulse"></div>
            <div className="border rounded-xl overflow-hidden bg-card shadow-sm p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" data-testid="text-app-title">
              Labor Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Track duties, advances, and payments efficiently</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="w-full sm:max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AddLaborDialog onAdd={handleAddLabor} />
            <AddDutyDialog laborers={laborers} onAdd={handleAddDuty} />
            <AddAdvanceDialog laborers={laborers} onAdd={handleAddAdvance} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-primary rounded-full"></div>
              <div>
                <h2 className="text-lg font-semibold">Labor Records</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {filteredLaborers.length} {filteredLaborers.length === 1 ? 'laborer' : 'laborers'} 
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              </div>
            </div>
          </div>
          <LaborTable laborers={laborTableData} onEdit={handleEditLabor} onDelete={handleDeleteLabor} onPdfPreview={handlePdfPreview} onPdfDownload={handlePdfDownload} />
        </div>

        <SummaryCards
          totalLaborers={totalLaborers}
          totalDuty={totalDuty}
          totalAdvance={totalAdvance}
          netPayable={netPayable}
        />
      </main>
    </div>
  );
}
