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
      <Card className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-none bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            Total Laborers
          </CardTitle>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Users className="h-6 w-6 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tabular-nums text-blue-900 dark:text-blue-100" data-testid="text-total-laborers">
            {totalLaborers}
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 font-medium">Active workers</p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-none bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-green-900 dark:text-green-100">
            Total Duty Amount
          </CardTitle>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 dark:from-green-500 dark:to-green-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Wallet className="h-6 w-6 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tabular-nums text-green-900 dark:text-green-100" data-testid="text-total-duty">
            ₹{totalDuty.toLocaleString()}
          </div>
          <p className="text-sm text-green-700 dark:text-green-300 mt-2 font-medium">Total earnings</p>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-none bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20">
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-orange-900 dark:text-orange-100">
            Total Advance
          </CardTitle>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-500 dark:to-orange-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <TrendingDown className="h-6 w-6 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tabular-nums text-orange-900 dark:text-orange-100" data-testid="text-total-advance">
            ₹{totalAdvance.toLocaleString()}
          </div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mt-2 font-medium">Advanced payments</p>
        </CardContent>
      </Card>

      <Card className={`group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-none ${
        netPayable >= 0 
          ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20' 
          : 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
          <CardTitle className={`text-sm font-semibold ${
            netPayable >= 0 ? 'text-emerald-900 dark:text-emerald-100' : 'text-red-900 dark:text-red-100'
          }`}>
            Net Payable
          </CardTitle>
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
            netPayable >= 0 
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700' 
              : 'bg-gradient-to-br from-red-500 to-red-600 dark:from-red-500 dark:to-red-700'
          }`}>
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div 
            className={`text-4xl font-bold tabular-nums ${
              netPayable >= 0 ? 'text-emerald-900 dark:text-emerald-100' : 'text-red-900 dark:text-red-100'
            }`}
            data-testid="text-net-payable"
          >
            ₹{netPayable.toLocaleString()}
          </div>
          <p className={`text-sm mt-2 font-medium ${
            netPayable >= 0 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
          }`}>
            {netPayable >= 0 ? 'To be paid' : 'Overpaid'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
