import { useState, useMemo } from "react";
import SummaryCards from "@/components/SummaryCards";
import LaborTable from "@/components/LaborTable";
import AddLaborDialog from "@/components/AddLaborDialog";
import AddDutyDialog from "@/components/AddDutyDialog";
import AddAdvanceDialog from "@/components/AddAdvanceDialog";
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from "@/components/SearchBar";
import { useToast } from "@/hooks/use-toast";

interface Labor {
  id: string;
  name: string;
  dailyRate: number;
  totalDuty: number;
  totalAdvance: number;
}

export default function HomePage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  //todo: remove mock functionality
  const [laborers, setLaborers] = useState<Labor[]>([
    { id: '1', name: 'Rajesh Kumar', dailyRate: 800, totalDuty: 12000, totalAdvance: 5000 },
    { id: '2', name: 'Amit Sharma', dailyRate: 750, totalDuty: 9500, totalAdvance: 3000 },
    { id: '3', name: 'Vijay Singh', dailyRate: 900, totalDuty: 15000, totalAdvance: 7000 },
  ]);

  const handleAddLabor = (name: string, dailyRate: number) => {
    const newLabor: Labor = {
      id: Date.now().toString(),
      name,
      dailyRate,
      totalDuty: 0,
      totalAdvance: 0,
    };
    setLaborers([...laborers, newLabor]);
    toast({
      title: "Labor Added",
      description: `${name} has been added successfully.`,
    });
  };

  const handleAddDuty = (laborId: string, multiplier: number) => {
    setLaborers(laborers.map(labor => {
      if (labor.id === laborId) {
        const dutyAmount = labor.dailyRate * multiplier;
        return {
          ...labor,
          totalDuty: labor.totalDuty + dutyAmount,
        };
      }
      return labor;
    }));
    toast({
      title: "Duty Added",
      description: "Duty entry has been recorded successfully.",
    });
  };

  const handleAddAdvance = (laborId: string, amount: number) => {
    setLaborers(laborers.map(labor => {
      if (labor.id === laborId) {
        return {
          ...labor,
          totalAdvance: labor.totalAdvance + amount,
        };
      }
      return labor;
    }));
    toast({
      title: "Advance Added",
      description: "Advance payment has been recorded successfully.",
    });
  };

  const handleDeleteLabor = (id: string) => {
    const labor = laborers.find(l => l.id === id);
    setLaborers(laborers.filter(l => l.id !== id));
    toast({
      title: "Labor Deleted",
      description: `${labor?.name} has been removed successfully.`,
      variant: "destructive",
    });
  };

  const filteredLaborers = useMemo(() => {
    if (!searchQuery.trim()) return laborers;
    return laborers.filter(labor =>
      labor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [laborers, searchQuery]);

  const totalLaborers = laborers.length;
  const totalDuty = laborers.reduce((sum, labor) => sum + labor.totalDuty, 0);
  const totalAdvance = laborers.reduce((sum, labor) => sum + labor.totalAdvance, 0);
  const netPayable = totalDuty - totalAdvance;

  const laborTableData = filteredLaborers.map(labor => ({
    id: labor.id,
    name: labor.name,
    totalDuty: labor.totalDuty,
    totalAdvance: labor.totalAdvance,
    netPayable: labor.totalDuty - labor.totalAdvance,
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold" data-testid="text-app-title">
            Labor Management
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <SummaryCards
          totalLaborers={totalLaborers}
          totalDuty={totalDuty}
          totalAdvance={totalAdvance}
          netPayable={netPayable}
        />

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <AddLaborDialog onAdd={handleAddLabor} />
            <AddDutyDialog laborers={laborers} onAdd={handleAddDuty} />
            <AddAdvanceDialog laborers={laborers} onAdd={handleAddAdvance} />
          </div>
          <div className="w-full sm:max-w-md">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>

        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Labor Records</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredLaborers.length} {filteredLaborers.length === 1 ? 'laborer' : 'laborers'} 
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          <LaborTable laborers={laborTableData} onDelete={handleDeleteLabor} />
        </div>
      </main>
    </div>
  );
}
