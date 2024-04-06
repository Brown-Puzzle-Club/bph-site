interface SubscriptionModalProps {
  onClose: () => void; // Define prop for closing the modal
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
  // State to track if the modal is open or closed

  // Function to handle closing the modal
  const handleClose = () => {
    onClose(); // Call the onClose prop to inform the parent component
  };

  // Render the modal only if isOpen is true
  return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="fixed inset-x-0 bottom-0 mx-auto p-6 bg-white rounded-t-lg shadow-lg">
          {/* Modal Content */}
          <div className="text-center h-96 items-center justify-center flex flex-col">
            <p className="">
              You've reached your limit of free articles. Already a subscriber?{" "}
              <b>Log in</b>
            </p>
            <div className="border-2 border-blue-500 rounded-md max-w-screen-md py-5 mt-4 w-9/12">
              <h2 className="text-xl font-bold mb-4 ">Special offer:</h2>
              <h2 className="text-xl">
                Get unlimited access by clicking the 'Subscribe
              </h2>
              <h2 className="text-xl mb-4">Now' button below.</h2>
              <h2 className="text-xl mb-4 text-zinc-500">$0.00/week</h2>

              <button
                className="font-sans bg-blue-500 text-white font-semibold py-2 px-8 rounded-md hover:bg-blue-600 mr-2"
                onClick={handleClose} // Call handleClose when Subscribe Now button is clicked
              >
                SUBSCRIBE NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    )

};

export default SubscriptionModal;
