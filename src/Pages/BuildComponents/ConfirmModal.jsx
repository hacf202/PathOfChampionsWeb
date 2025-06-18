import { useRef } from "react";

function ConfirmModal({ isOpen, onConfirm, onCancel, message }) {
	const modalRef = useRef(null);

	if (!isOpen) return null;

	// Xử lý nhấp chuột ra ngoài ConfirmModal
	const handleOverlayClick = e => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			console.log("Overlay clicked in ConfirmModal, calling onCancel");
			onCancel();
		}
	};

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60'
			onClick={handleOverlayClick}
		>
			<div
				ref={modalRef}
				className='bg-gray-800 p-5 rounded-lg w-full max-w-sm shadow-xl animate-fade-in'
			>
				<p className='text-white text-center mb-4'>{message}</p>
				<div className='flex justify-center gap-2'>
					<button
						onClick={e => {
							e.stopPropagation(); // Ngăn chặn event bubbling
							console.log("Confirm button clicked");
							onConfirm();
						}}
						className='px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition duration-150 transform hover:scale-105'
					>
						Đồng ý
					</button>
					<button
						onClick={e => {
							e.stopPropagation(); // Ngăn chặn event bubbling
							console.log("Cancel button clicked");
							onCancel();
						}}
						className='px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition duration-150 transform hover:scale-105'
					>
						Hủy
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmModal;
