interface DeleteButtonProps {
  onClick: () => void;
  label?: string;
}

export const DeleteButton = ({
  onClick,
  label = "Delete",
}: DeleteButtonProps) => {
  return (
    <button onClick={onClick} className="text-red-500 hover:underline cursor-pointer">
      {label}
    </button>
  );
};
