import AddLaborDialog from '../AddLaborDialog';

export default function AddLaborDialogExample() {
  return (
    <AddLaborDialog
      onAdd={(name, rate) => console.log('Add labor:', name, rate)}
    />
  );
}
