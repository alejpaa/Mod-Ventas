export const SellerType = {
  Interno: 'Interno',
  Externo: 'Externo',
} as const
export type SellerType = typeof SellerType[keyof typeof SellerType]

interface TypePillProps {
  type: SellerType;
}

const TypePill = ({ type }: TypePillProps) => {
  const isInternal = type === SellerType.Interno;
  const classes = isInternal
    ? 'bg-blue-100 text-blue-800'
    : 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {type}
    </span>
  );
};

export default TypePill;