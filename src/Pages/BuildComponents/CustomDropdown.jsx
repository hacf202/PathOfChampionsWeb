import { useState, useCallback, useMemo } from "react";
import { memo } from "react";

function CustomDropdown({
	name,
	value,
	options,
	onSelect,
	dropdownId,
	placeholder,
	ariaLabel,
	index,
	isOpen,
	onToggle,
}) {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredOptions = useMemo(() => {
		return options.filter(option =>
			option.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [options, searchTerm]);

	const handleSelect = useCallback(
		selectedValue => {
			onSelect(name, selectedValue, index);
			setSearchTerm("");
			onToggle(null); // Close dropdown after selection
		},
		[name, index, onSelect, onToggle]
	);

	const handleToggle = useCallback(() => {
		onToggle(dropdownId);
	}, [dropdownId, onToggle]);

	return (
		<div className='relative w-full'>
			<button
				type='button'
				onClick={handleToggle}
				className='p-2 rounded-md text-black bg-white w-full text-left flex items-center justify-between shadow-sm border border-gray-300 hover:bg-gray-50 transition duration-150'
				aria-label={ariaLabel}
				aria-controls={`dropdown-menu-${dropdownId}`}
			>
				<span className='truncate flex-1'>{value || placeholder}</span>
				<svg
					className='w-4 h-4 text-gray-600'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='2'
						d='M19 9l-7 7-7-7'
					/>
				</svg>
			</button>
			{isOpen && (
				<div
					id={`dropdown-menu-${dropdownId}`}
					className='absolute z-20 mt-1 w-full min-w-[200px] max-w-[300px] bg-gray-800 rounded-md shadow-lg max-h-60 overflow-y-auto overflow-x-hidden border border-gray-600'
				>
					<input
						type='text'
						placeholder='Tìm kiếm...'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						className='p-2 m-2 rounded-md text-black w-[calc(100%-16px)] text-sm'
						aria-label={`Tìm kiếm ${placeholder}`}
					/>
					<ul className='py-1 w-full'>
						<li
							className='flex items-center px-3 py-2 text-white hover:bg-gray-700 cursor-pointer w-full transition duration-150 max-w-full'
							onClick={() => handleSelect("")}
						>
							<span className='flex-1 truncate'>{placeholder}</span>
						</li>
						{filteredOptions.length === 0 ? (
							<li className='px-3 py-2 text-gray-400 w-full max-w-full'>
								Không tìm thấy
							</li>
						) : (
							filteredOptions.map((option, idx) => (
								<li
									key={idx}
									className='flex items-center px-3 py-2 text-white hover:bg-gray-700 cursor-pointer w-full transition duration-150 max-w-full group relative'
									onClick={() => handleSelect(option.name)}
								>
									{option.image && (
										<img
											src={option.image}
											alt={option.name}
											className='w-6 h-6 mr-2 object-cover rounded'
											loading='lazy'
										/>
									)}
									<span className='flex-1 truncate'>{option.name}</span>
									{option.description && (
										<span className='absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 max-w-[200px] z-30 left-full ml-2 top-0 whitespace-normal break-words'>
											{option.description}
										</span>
									)}
								</li>
							))
						)}
					</ul>
				</div>
			)}
		</div>
	);
}

export default memo(CustomDropdown);
