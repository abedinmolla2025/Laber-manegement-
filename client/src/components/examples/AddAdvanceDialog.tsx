import AddAdvanceDialog from '../AddAdvanceDialog';

export default function AddAdvanceDialogExample() {
  const mockLaborers = [
    { id: '1', name: 'Karim' },
    { id: '2', name: 'Rahim' },
    { id: '3', name: 'Salim' },
  ];

  return (
    <AddAdvanceDialog
      laborers={mockLaborers}
      onAdd={(laborId, amount) => console.log('Add advance:', laborId, amount)}
    />
  );
}
