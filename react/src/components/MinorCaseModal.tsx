// Modal.tsx
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  caseName: string;
}

const MinorCaseModal: React.FC<ModalProps> = ({ isOpen, closeModal, caseName }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-md w-3/5 h-1/2">
            <h2 className="text-purple-500">{caseName}</h2>
            {/* Add other modal content as needed */}
            <button onClick={closeModal}>Close</button>
        </div>
    </div>
  );
};

export default MinorCaseModal;
