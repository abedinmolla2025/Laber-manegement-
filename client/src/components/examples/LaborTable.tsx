import LaborTable from '../LaborTable';

export default function LaborTableExample() {
  const mockLaborers = [
    { id: '1', name: 'Karim', totalDuty: 12000, totalAdvance: 5000, netPayable: 7000 },
    { id: '2', name: 'Rahim', totalDuty: 9500, totalAdvance: 3000, netPayable: 6500 },
    { id: '3', name: 'Salim', totalDuty: 15000, totalAdvance: 7000, netPayable: 8000 },
  ];

  return (
    <LaborTable
      laborers={mockLaborers}
      onDelete={(id) => console.log('Delete labor:', id)}
    />
  );
}
