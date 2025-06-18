import { useRef, useState, useCallback, useMemo } from "react";
import SelectionGroup from "./SelectionGroup";
import ConfirmModal from "./ConfirmModal";

function AddBuildModal({
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
		console.log("Calculating hasData");
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
		console.log("handleClose called, hasData:", hasData);
		if (hasData) {
			setIsConfirmOpen(true);
		} else {
			console.log("No data, closing AddBuildModal");
			onClose();
		}
	}, [hasData, onClose]);

	// Memoize hàm xử lý nhấp ra ngoài
	const handleOverlayClick = useCallback(
		e => {
			if (modalRef.current && !modalRef.current.contains(e.target)) {
				console.log("Overlay clicked in AddBuildModal");
				handleClose();
			}
		},
		[handleClose]
	);

	// Memoize hàm xử lý onCancel
	const handleCancel = useCallback(() => {
		console.log("onCancel called, setting isConfirmOpen to false");
		setIsConfirmOpen(false);
	}, []);

	// Memoize hàm xử lý onConfirm
	const handleConfirm = useCallback(() => {
		console.log("handleConfirm called, closing ConfirmModal and AddBuildModal");
		setIsConfirmOpen(false);
		onClose();
	}, [onClose]);

	if (!isOpen) return null;

	return (
		<div
			className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50'
			onClick={handleOverlayClick}
		>
			<div
				ref={modalRef}
				className='bg-gray-700 p-5 rounded-lg w-full max-w-2xl shadow-xl animate-fade-in'
			>
				<h2 className='text-xl font-bold mb-4'>Thêm Build Mới</h2>
				<div className='flex flex-col gap-3'>
					<SelectionGroup
						formData={formData}
						setFormData={setFormData}
						errors={errors}
						championsList={championsList}
						relicsList={relicsList}
						itemsList={itemsList}
						powersList={powersList}
						mode='add'
					/>
					<div className='flex justify-center gap-2 mt-4'>
						<button
							onClick={onSave}
							className='px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition duration-150 transform hover:scale-105'
						>
							Lưu
						</button>
						<button
							onClick={handleClose}
							className='px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition duration-150 transform hover:scale-105'
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
				message='Bạn đã nhập dữ liệu. Bạn có chắc muốn đóng modal mà không lưu?'
			/>
		</div>
	);
}

export default AddBuildModal;
