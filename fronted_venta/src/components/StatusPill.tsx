export const SellerStatus = {
  Activo: 'Activo',
  Inactivo: 'Inactivo',
} as const
export type SellerStatus = typeof SellerStatus[keyof typeof SellerStatus]

interface StatusPillProps {
  status: SellerStatus;
}

const StatusPill = ({ status }: StatusPillProps) => {
  const isActive = status === SellerStatus.Activo;
  const classes = isActive
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {status}
    </span>
  );
};

export default StatusPill;