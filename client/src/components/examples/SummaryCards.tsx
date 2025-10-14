import SummaryCards from '../SummaryCards';

export default function SummaryCardsExample() {
  return (
    <SummaryCards
      totalLaborers={12}
      totalDuty={45000}
      totalAdvance={15000}
      netPayable={30000}
    />
  );
}
