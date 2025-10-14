import AddDutyDialog from '../AddDutyDialog';

export default function AddDutyDialogExample() {
  const mockLaborers = [
    { id: '1', name: 'Karim', dailyRate: 800 },
    { id: '2', name: 'Rahim', dailyRate: 750 },
    { id: '3', name: 'Salim', dailyRate: 900 },
  ];

  return (
    <AddDutyDialog
      laborers={mockLaborers}
      onAdd={(laborId, multiplier, date) => console.log('Add duty:', laborId, multiplier, date)}
    />
  );
}
