import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
  totalDuty: number;
  totalAdvance: number;
  netPayable: number;
}

interface LaborTableProps {
  laborers: LaborData[];
  onDelete: (id: string) => void;
}

export default function LaborTable({ laborers, onDelete }: LaborTableProps) {
  if (laborers.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No laborers added yet. Add your first laborer to get started.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Labor Name</TableHead>
            <TableHead className="text-right font-semibold">Total Duty</TableHead>
            <TableHead className="text-right font-semibold">Total Advance</TableHead>
            <TableHead className="text-right font-semibold">Net Payable</TableHead>
            <TableHead className="text-center font-semibold w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {laborers.map((labor) => (
            <TableRow key={labor.id} data-testid={`row-labor-${labor.id}`}>
              <TableCell className="font-medium" data-testid={`text-name-${labor.id}`}>
                {labor.name}
              </TableCell>
              <TableCell className="text-right tabular-nums" data-testid={`text-duty-${labor.id}`}>
                ₹{labor.totalDuty.toLocaleString()}
              </TableCell>
              <TableCell className="text-right tabular-nums" data-testid={`text-advance-${labor.id}`}>
                ₹{labor.totalAdvance.toLocaleString()}
              </TableCell>
              <TableCell 
                className={`text-right tabular-nums font-medium ${
                  labor.netPayable >= 0 ? 'text-chart-2' : 'text-chart-3'
                }`}
                data-testid={`text-net-${labor.id}`}
              >
                ₹{labor.netPayable.toLocaleString()}
              </TableCell>
              <TableCell className="text-center">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
