import SelectionGroup from "./SelectionGroup";

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
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50'>
			<div className='bg-gray-700 p-5 rounded-lg w-full max-w-xl shadow-xl  animate-fade-in'>
				<h2 className='text-xl font-bold mb-4'>Sửa Build</h2>
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
							className='px-4 py-2 bg-green-600 rounded-md hover:bg-green-700 transition duration-150 transform hover:scale-105'
						>
							Lưu
						</button>
						<button
							onClick={onClose}
							className='px-4 py-2 bg-red-600 rounded-md hover:bg-red-700 transition duration-150 transform hover:scale-105'
						>
							Hủy
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default EditBuildModal;
