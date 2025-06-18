import { useRef, useState, useCallback, useMemo } from "react";
import SelectionGroup from "./SelectionGroup";
import ConfirmModal from "./ConfirmModal"; // Giả định sử dụng ConfirmModal tương tự AddBuildModal

function EditBuildModal({
	isOpen,
	onClose,
	formData,
	setFormData,
	errors,
	championsList,
	relicsList,
	itemsList,
	powersList,
	onSave,
}) {
	const modalRef = useRef(null);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	// Memoize hàm kiểm tra dữ liệu
	const hasData = useMemo(() => {
		return (
			formData.championName !== "" ||
			formData.artifacts.some(artifact => artifact !== "") ||
			formData.items.some(item => item !== "") ||
			formData.powers.some(power => power !== "") ||
			formData.description !== "" ||
			formData.creator !== ""
		);
	}, [formData]);

	// Memoize hàm xử lý đóng modal
	const handleClose = useCallback(() => {
		if (hasData) {
			setIsConfirmOpen(true);
		} else {
			onClose();
		}
	}, [hasData, onClose]);

	// Memoize hàm xử lý nhấp ra ngoài
	const handleOverlayClick = useCallback(
		e => {
			if (modalRef.current && !modalRef.current.contains(e.target)) {
				handleClose();
			}
		},
		[handleClose]
	);

	// Memoize hàm xử lý onCancel
	const handleCancel = useCallback(() => {
		setIsConfirmOpen(false);
	}, []);

	// Memoize hàm xử lý onConfirm
	const handleConfirm = useCallback(() => {
		setIsConfirmOpen(false);
		onClose();
	}, [onClose]);

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto'
			onClick={handleOverlayClick}
		>
			<div
				ref={modalRef}
				className='bg-gray-700 p-4 sm:p-5 rounded-lg w-full max-w-md sm:max-w-xl mx-4 sm:mx-0 shadow-xl animate-fade-in'
			>
				<h2 className='text-lg sm:text-xl font-bold mb-4'>Sửa Build</h2>
				<div className='flex flex-col gap-3'>
					<SelectionGroup
						formData={formData}
						setFormData={setFormData}
						errors={errors}
						championsList={championsList}
						relicsList={relicsList}
						itemsList={itemsList}
						powersList={powersList}
						mode='edit'
					/>
					<div className='flex justify-center gap-2 mt-4'>
						<button
							onClick={onSave}
							className='px-3 sm:px-4 py-1.5 sm:py-2 bg-green-600 rounded-md hover:bg-green-700 transition duration-150 transform hover:scale-105 text-sm sm:text-base'
						>
							Lưu
						</button>
						<button
							onClick={handleClose}
							className='px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 rounded-md hover:bg-red-700 transition duration-150 transform hover:scale-105 text-sm sm:text-base'
						>
							Hủy
						</button>
					</div>
				</div>
			</div>
			<ConfirmModal
				isOpen={isConfirmOpen}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
				message='Bạn đã chỉnh sửa dữ liệu. Bạn có chắc muốn đóng modal mà không lưu?'
			/>
		</div>
	);
}

export default EditBuildModal;
