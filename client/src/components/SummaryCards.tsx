import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, TrendingUp, DollarSign } from "lucide-react";

interface SummaryCardsProps {
  totalLaborers: number;
  totalDuty: number;
  totalAdvance: number;
  netPayable: number;
}

export default function SummaryCards({
  totalLaborers,
  totalDuty,
  totalAdvance,
  netPayable,
}: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Laborers
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold tabular-nums" data-testid="text-total-laborers">
            {totalLaborers}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Duty Amount
          </CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold tabular-nums" data-testid="text-total-duty">
            ₹{totalDuty.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Advance
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold tabular-nums" data-testid="text-total-advance">
            ₹{totalAdvance.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Net Payable
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div 
            className={`text-3xl font-semibold tabular-nums ${
              netPayable >= 0 ? 'text-chart-2' : 'text-chart-3'
            }`}
            data-testid="text-net-payable"
          >
            ₹{netPayable.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
