import { useState, useCallback } from "react";
import { memo } from "react";
import CustomDropdown from "./CustomDropdown";

function SelectionGroup({
	formData,
	setFormData,
	errors,
	championsList,
	relicsList,
	itemsList,
	powersList,
	mode,
}) {
	const [openDropdownId, setOpenDropdownId] = useState(null);

	const handleInputChange = useCallback(
		(name, value, index = null) => {
			if (
				(name === "artifacts" || name === "items" || name === "powers") &&
				index !== null
			) {
				const updatedArray = [...formData[name]];
				updatedArray[index] = value;
				setFormData({ ...formData, [name]: updatedArray });
			} else {
				setFormData({ ...formData, [name]: value });
			}
		},
		[formData, setFormData]
	);

	const handleToggleDropdown = useCallback(dropdownId => {
		setOpenDropdownId(prev => (prev === dropdownId ? null : dropdownId));
	}, []);

	return (
		<>
			{/* Chọn tướng */}
			<div className='flex justify-between items-center'>
				<div className='w-[80%]'>
					<CustomDropdown
						name='championName'
						value={formData.championName}
						options={championsList}
						onSelect={handleInputChange}
						dropdownId={`champion-${mode}`}
						placeholder='Chọn tướng'
						ariaLabel='Chọn tướng'
						isOpen={openDropdownId === `champion-${mode}`}
						onToggle={handleToggleDropdown}
					/>
				</div>
				{formData.championName && (
					<img
						src={
							championsList.find(champ => champ.name === formData.championName)
								?.image || "/images/placeholder.png"
						}
						alt={formData.championName}
						className='h-16 object-cover rounded mr-10'
						loading='lazy'
					/>
				)}
				{errors.championName && (
					<p className='text-red-500 text-xs mt-1'>{errors.championName}</p>
				)}
			</div>

			{/* Chọn cổ vật */}
			<div>
				<p className='text-sm text-gray-300 mb-1'>
					Cổ vật (bắt buộc ít nhất 1):
				</p>
				<div className='grid grid-cols-3 gap-2'>
					{formData.artifacts.map((artifact, index) => (
						<CustomDropdown
							key={index}
							name='artifacts'
							value={artifact}
							options={relicsList}
							onSelect={handleInputChange}
							dropdownId={`artifact-${mode}-${index}`}
							placeholder={`Cổ vật ${index + 1}`}
							ariaLabel={`Chọn cổ vật ${index + 1}`}
							index={index}
							isOpen={openDropdownId === `artifact-${mode}-${index}`}
							onToggle={handleToggleDropdown}
						/>
					))}
				</div>
				<div className='flex flex-wrap gap-2 mt-2'>
					{formData.artifacts.map(
						(artifact, index) =>
							artifact && (
								<img
									key={index}
									src={
										relicsList.find(relic => relic.name === artifact)?.image ||
										"/images/placeholder.png"
									}
									alt={artifact}
									className='w-12 h-12 object-cover rounded'
									loading='lazy'
								/>
							)
					)}
				</div>
				{errors.artifacts && (
					<p className='text-red-500 text-xs mt-1'>{errors.artifacts}</p>
				)}
			</div>

			{/* Chọn vật phẩm */}
			<div>
				<p className='text-sm text-gray-300 mb-1'>
					Vật phẩm (tùy chọn, tối đa 6):
				</p>
				<div className='grid grid-cols-3 gap-2'>
					{formData.items.map((item, index) => (
						<CustomDropdown
							key={index}
							name='items'
							value={item}
							options={itemsList}
							onSelect={handleInputChange}
							dropdownId={`item-${mode}-${index}`}
							placeholder={`Vật phẩm ${index + 1}`}
							ariaLabel={`Chọn vật phẩm ${index + 1}`}
							index={index}
							isOpen={openDropdownId === `item-${mode}-${index}`}
							onToggle={handleToggleDropdown}
						/>
					))}
				</div>
				<div className='flex flex-wrap gap-2 mt-2'>
					{formData.items.map(
						(item, index) =>
							item && (
								<img
									key={index}
									src={
										itemsList.find(i => i.name === item)?.image ||
										"/images/placeholder.png"
									}
									alt={item}
									className='w-12 h-12 object-cover rounded'
									loading='lazy'
								/>
							)
					)}
				</div>
			</div>

			{/* Chọn sức mạnh */}
			<div>
				<p className='text-sm text-gray-300 mb-1'>
					Sức mạnh (tùy chọn, tối đa 6):
				</p>
				<div className='grid grid-cols-3 gap-2'>
					{formData.powers.map((power, index) => (
						<CustomDropdown
							key={index}
							name='powers'
							value={power}
							options={powersList}
							onSelect={handleInputChange}
							dropdownId={`power-${mode}-${index}`}
							placeholder={`Sức mạnh ${index + 1}`}
							ariaLabel={`Chọn sức mạnh ${index + 1}`}
							index={index}
							isOpen={openDropdownId === `power-${mode}-${index}`}
							onToggle={handleToggleDropdown}
						/>
					))}
				</div>
				<div className='flex flex-wrap gap-2 mt-2'>
					{formData.powers.map(
						(power, index) =>
							power && (
								<img
									key={index}
									src={
										powersList.find(p => p.name === power)?.image ||
										"/images/placeholder.png"
									}
									alt={power}
									className='w-12 h-12 object-cover rounded'
									loading='lazy'
								/>
							)
					)}
				</div>
			</div>

			{/* Mô tả */}
			<textarea
				name='description'
				value={formData.description}
				onChange={e => handleInputChange("description", e.target.value)}
				placeholder='Mô tả build (tùy chọn)'
				className='p-2 rounded-md text-black resize-none h-20'
				aria-label='Mô tả build'
			/>

			{/* Người tạo */}
			<input
				type='text'
				name='creator'
				value={formData.creator}
				onChange={e => handleInputChange("creator", e.target.value)}
				placeholder='Tên người tạo (tùy chọn)'
				className='p-2 rounded-md text-black'
				aria-label='Tên người tạo'
			/>
		</>
	);
}

export default memo(SelectionGroup);
