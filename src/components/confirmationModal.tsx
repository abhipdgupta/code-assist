const ConfirmationModal = ({
  message,
  onCancel,
  onConfirm,
}: {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div className="absolute top-0 left-0 overflow-hidden h-full backdrop-blur-md"
        onClick={(e)=>{
            e.stopPropagation()
            onCancel()
        }}
    >
      <div className="flex items-center justify-center h-full p-4">
        <div className="rounded-lg bg-slate-900 p-4">
          <div className="mb-4">{message}</div>
          <div className="flex justify-center">
            <button
              onClick={onConfirm}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Confirm
            </button>
            <button
              onClick={onCancel}    
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
