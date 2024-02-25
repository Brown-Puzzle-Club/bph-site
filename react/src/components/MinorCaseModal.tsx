import React from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  caseID : number;
  onSubmit: (caseID : number) => void;
}

const MinorCaseModal: React.FC<ModalProps> = ({ isOpen, closeModal, caseID,  onSubmit}) => {
  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    onSubmit(caseID);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-md w-3/5 h-1/2">
            <h2 className="text-purple-500">{caseID}</h2>
            {/* Add other modal content as needed */}
            <button onClick={closeModal}>Close</button>

            <button onClick={handleSubmit}>Complete</button>
        </div>
    </div>
  );
};

export default MinorCaseModal;
