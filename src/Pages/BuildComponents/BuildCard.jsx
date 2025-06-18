import { memo, useMemo, useState } from "react";
import ConfirmModal from "./ConfirmModal";

function BuildCard({
	build,
	championsList,
	relicsList,
	itemsList,
	powersList,
	onEdit,
	onDelete,
}) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);

	// Memoize champion lookup
	const championImage = useMemo(() => {
		return (
			championsList.find(champ => champ.name === build.championName)?.image ||
			"/images/placeholder.png"
		);
	}, [championsList, build.championName]);

	// Memoize artifacts, items, and powers lookups
	const artifactImages = useMemo(() => {
		return build.artifacts.map(artifact =>
			artifact
				? relicsList.find(relic => relic.name === artifact)?.image ||
				  "/images/placeholder.png"
				: null
		);
	}, [relicsList, build.artifacts]);

	const itemImages = useMemo(() => {
		return build.items.map(item =>
			item
				? itemsList.find(i => i.name === item)?.image ||
				  "/images/placeholder.png"
				: null
		);
	}, [itemsList, build.items]);

	const powerImages = useMemo(() => {
		return build.powers.map(power =>
			power
				? powersList.find(p => p.name === power)?.image ||
				  "/images/placeholder.png"
				: null
		);
	}, [powersList, build.powers]);

	// Handle delete click
	const handleDeleteClick = () => {
		setIsConfirmOpen(true);
	};

	// Handle confirm delete
	const handleConfirmDelete = () => {
		setIsConfirmOpen(false);
		onDelete();
	};

	// Handle cancel delete
	const handleCancelDelete = () => {
		setIsConfirmOpen(false);
	};

	return (
		<div className='bg-gray-600 p-4 sm:p-5 rounded-lg transition duration-200'>
			<div className='flex items-center gap-3 mb-3 h-16 bg-gray-500 rounded-md'>
				<div className='relative group'>
					<img
						src={championImage}
						alt={build.championName}
						className='w-16 h-16 object-cover rounded'
						loading='lazy'
					/>
					<span className='max-w-[calc(100vw-16px)] absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 bg-opacity-30 text-white text-xs rounded px-2 py-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100'>
						{build.championName}
					</span>
				</div>
				<h3 className='text-base sm:text-lg font-bold truncate'>
					{build.championName}
				</h3>
			</div>
			<div className='mb-3'>
				<p className='text-gray-300 text-sm sm:text-base'>Cổ vật:</p>
				<div className='flex gap-2 mt-1'>
					{build.artifacts.map(
						(artifact, index) =>
							artifact && (
								<div key={index} className='relative group'>
									<img
										src={artifactImages[index]}
										alt={artifact}
										className='w-10 h-10 sm:w-12 sm:h-12 object-cover bg-gray-500 rounded-md'
										loading='lazy'
									/>
									<span className='max-w-[calc(100vw-16px)] absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 bg-opacity-30 text-white text-xs rounded px-2 py-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100'>
										{artifact}
									</span>
								</div>
							)
					)}
				</div>
			</div>
			{build.items.some(item => item) && (
				<div className='mb-3'>
					<p className='text-gray-300 text-sm sm:text-base'>Vật phẩm:</p>
					<div className='flex flex-wrap gap-2 mt-1'>
						{build.items.map(
							(item, index) =>
								item && (
									<div key={index} className='relative group'>
										<img
											src={itemImages[index]}
											alt={item}
											className='w-10 h-10 sm:w-12 sm:h-12 object-cover bg-gray-500 rounded-md'
											loading='lazy'
										/>
										<span className='max-w-[calc(100vw-16px)] absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 bg-opacity-30 text-white text-xs rounded px-2 py-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100'>
											{item}
										</span>
									</div>
								)
						)}
					</div>
				</div>
			)}
			{build.powers.some(power => power) && (
				<div className='mb-3'>
					<p className='text-gray-300 text-sm sm:text-base'>Sức mạnh:</p>
					<div className='flex flex-wrap gap-2 mt-1'>
						{build.powers.map(
							(power, index) =>
								power && (
									<div key={index} className='relative group'>
										<img
											src={powerImages[index]}
											alt={power}
											className='w-10 h-10 sm:w-12 sm:h-12 object-cover bg-gray-500 rounded-md'
											loading='lazy'
										/>
										<span className='max-w-[calc(100vw-16px)] absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 bg-opacity-30 text-white text-xs rounded px-2 py-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100'>
											{power}
										</span>
									</div>
								)
						)}
					</div>
				</div>
			)}
			<p className='text-gray-300 text-sm sm:text-base mb-2 bg-gray-500 rounded-md p-2'>
				Mô tả: {build.description || "Không có mô tả"}
			</p>
			<p className='text-gray-300 text-sm sm:text-base mb-3 bg-gray-500 rounded-md p-2'>
				Người tạo: {build.creator || "Ẩn danh"}
			</p>
			<div className='flex gap-2'>
				<button
					onClick={onEdit}
					className='flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-green-600 rounded-md hover:bg-green-700 transition duration-150 transform hover:scale-105 text-sm sm:text-base'
				>
					Cập nhật
				</button>
				<button
					onClick={handleDeleteClick}
					className='flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-600 rounded-md hover:bg-red-700 transition duration-150 transform hover:scale-105 text-sm sm:text-base'
				>
					Xóa
				</button>
			</div>
			<ConfirmModal
				isOpen={isConfirmOpen}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				message='Bạn có chắc muốn xóa build này không?'
			/>
		</div>
	);
}

export default memo(BuildCard);
