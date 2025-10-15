import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Download } from "lucide-react";
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

interface LaborData {
  id: string;
  name: string;
  dailyRate: number;
  totalDaily: number;
  totalDuty: number;
  totalAdvance: number;
  netPayable: number;
  dutyEntries: Array<{ date: string; daily: number; amount: number }>;
  advanceEntries: Array<{ date: string; amount: number }>;
}

interface LaborTableProps {
  laborers: LaborData[];
  onDelete: (id: string) => void;
  onPdfPreview: (labor: LaborData) => void;
  onPdfDownload: (labor: LaborData) => void;
}

export default function LaborTable({ laborers, onDelete, onPdfPreview, onPdfDownload }: LaborTableProps) {
  if (laborers.length === 0) {
    return (
      <div className="text-center py-20 border rounded-lg bg-card">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Trash2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">No Laborers Found</h3>
            <p className="text-sm text-muted-foreground">
              Add your first laborer to start tracking duties and advance payments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold w-[200px] sm:w-auto">Labor Name</TableHead>
              <TableHead className="text-right font-semibold hidden md:table-cell">Total Daily</TableHead>
              <TableHead className="text-right font-semibold hidden sm:table-cell">Total Duty</TableHead>
              <TableHead className="text-right font-semibold hidden sm:table-cell">Total Advance</TableHead>
              <TableHead className="text-right font-semibold">Net Payable</TableHead>
              <TableHead className="text-center font-semibold w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {laborers.map((labor) => (
            <TableRow key={labor.id} data-testid={`row-labor-${labor.id}`} className="hover-elevate">
              <TableCell data-testid={`text-name-${labor.id}`}>
                <div className="font-medium">{labor.name}</div>
                <div className="sm:hidden text-xs text-muted-foreground mt-1 space-y-0.5">
                  <div>Daily: {labor.totalDaily}</div>
                  <div>Duty: ₹{labor.totalDuty.toLocaleString()}</div>
                  <div>Advance: ₹{labor.totalAdvance.toLocaleString()}</div>
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums hidden md:table-cell" data-testid={`text-daily-${labor.id}`}>
                {labor.totalDaily}
              </TableCell>
              <TableCell className="text-right tabular-nums hidden sm:table-cell" data-testid={`text-duty-${labor.id}`}>
                ₹{labor.totalDuty.toLocaleString()}
              </TableCell>
              <TableCell className="text-right tabular-nums hidden sm:table-cell" data-testid={`text-advance-${labor.id}`}>
                ₹{labor.totalAdvance.toLocaleString()}
              </TableCell>
              <TableCell 
                className={`text-right tabular-nums font-semibold ${
                  labor.netPayable >= 0 ? 'text-chart-2' : 'text-chart-3'
                }`}
                data-testid={`text-net-${labor.id}`}
              >
                ₹{labor.netPayable.toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid={`button-pdf-preview-${labor.id}`}
                    title="Preview PDF Report"
                    onClick={() => onPdfPreview(labor)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid={`button-pdf-download-${labor.id}`}
                    title="Download PDF Report"
                    onClick={() => onPdfDownload(labor)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        data-testid={`button-delete-${labor.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Labor Record</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {labor.name}? This action cannot be undone and will remove all duty and advance records.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(labor.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          data-testid="button-confirm-delete"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
