import { useRef } from "react";

function ConfirmModal({ isOpen, onConfirm, onCancel, message }) {
	const modalRef = useRef(null);

	if (!isOpen) return null;

	// Xử lý nhấp chuột ra ngoài ConfirmModal
	const handleOverlayClick = e => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			onCancel();
		}
	};

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-60 overflow-y-auto'
			onClick={handleOverlayClick}
		>
			<div
				ref={modalRef}
				className='bg-gray-800 p-4 sm:p-5 rounded-lg w-full max-w-sm sm:max-w-md mx-4 sm:mx-0 shadow-xl animate-fade-in'
			>
				<p className='text-white text-center text-sm sm:text-base mb-4'>
					{message}
				</p>
				<div className='flex justify-center gap-2'>
					<button
						onClick={e => {
							e.stopPropagation();
							onConfirm();
						}}
						className='px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 rounded-md hover:bg-green-700 transition duration-150 transform hover:scale-105 text-sm sm:text-base'
					>
						Đồng ý
					</button>
					<button
						onClick={e => {
							e.stopPropagation();
							onCancel();
						}}
						className='px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 rounded-md hover:bg-red-700 transition duration-150 transform hover:scale-105 text-sm sm:text-base'
					>
						Hủy
					</button>
				</div>
			</div>
		</div>
	);
}

export default ConfirmModal;
