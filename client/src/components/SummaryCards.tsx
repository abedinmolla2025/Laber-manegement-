import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, TrendingDown, DollarSign } from "lucide-react";

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
      <Card className="hover-elevate transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">
            Total Laborers
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tabular-nums" data-testid="text-total-laborers">
            {totalLaborers}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Active workers</p>
        </CardContent>
      </Card>

      <Card className="hover-elevate transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">
            Total Duty Amount
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
            <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tabular-nums" data-testid="text-total-duty">
            ₹{totalDuty.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Total earnings</p>
        </CardContent>
      </Card>

      <Card className="hover-elevate transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">
            Total Advance
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tabular-nums" data-testid="text-total-advance">
            ₹{totalAdvance.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Advanced payments</p>
        </CardContent>
      </Card>

      <Card className="hover-elevate transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
          <CardTitle className="text-sm font-medium">
            Net Payable
          </CardTitle>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
            netPayable >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
          }`}>
            <DollarSign className={`h-5 w-5 ${
              netPayable >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`} />
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className={`text-3xl font-bold tabular-nums ${
              netPayable >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}
            data-testid="text-net-payable"
          >
            ₹{netPayable.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {netPayable >= 0 ? 'To be paid' : 'Overpaid'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
