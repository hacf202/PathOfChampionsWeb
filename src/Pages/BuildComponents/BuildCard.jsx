import { memo, useMemo } from "react";

function BuildCard({
	build,
	championsList,
	relicsList,
	itemsList,
	powersList,
	onEdit,
	onDelete,
}) {
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

	return (
		<div className='bg-gray-600 p-4 rounded-lg transition duration-200'>
			<div className='flex items-center gap-3 mb-3 h-16 bg-gray-500 rounded-md'>
				<div className='relative group'>
					<img
						src={championImage}
						alt={build.championName}
						className='h-16 object-cover rounded'
						loading='lazy'
					/>
					<span className='max-w-36 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 bg-opacity-30 text-white text-xs rounded px-2 py-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100'>
						{build.championName}
					</span>
				</div>
				<h3 className='text-lg font-bold truncate'>{build.championName}</h3>
			</div>
			<div className='mb-3'>
				<p className='text-gray-300 text-sm'>Cổ vật:</p>
				<div className='flex gap-2 mt-1'>
					{build.artifacts.map(
						(artifact, index) =>
							artifact && (
								<div key={index} className='relative group'>
									<img
										src={artifactImages[index]}
										alt={artifact}
										className='w-12 h-12 object-cover bg-gray-500 rounded-md'
										loading='lazy'
									/>
									<span className='w-36 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 bg-opacity-30 text-white text-xs rounded px-2 py-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100'>
										{artifact}
									</span>
								</div>
							)
					)}
				</div>
			</div>
			{build.items.some(item => item) && (
				<div className='mb-3'>
					<p className='text-gray-300 text-sm'>Vật phẩm:</p>
					<div className='flex flex-wrap gap-2 mt-1'>
						{build.items.map(
							(item, index) =>
								item && (
									<div key={index} className='relative group'>
										<img
											src={itemImages[index]}
											alt={item}
											className='w-12 h-12 object-cover bg-gray-500 rounded-md'
											loading='lazy'
										/>
										<span className='w-36 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 bg-opacity-30 text-white text-xs rounded px-2 py-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100'>
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
					<p className='text-gray-300 text-sm'>Sức mạnh:</p>
					<div className='flex flex-wrap gap-2 mt-1'>
						{build.powers.map(
							(power, index) =>
								power && (
									<div key={index} className='relative group'>
										<img
											src={powerImages[index]}
											alt={power}
											className='w-12 h-12 object-cover bg-gray-500 rounded-md'
											loading='lazy'
										/>
										<span className='w-36 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 bg-opacity-30 text-white text-xs rounded px-2 py-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100'>
											{power}
										</span>
									</div>
								)
						)}
					</div>
				</div>
			)}
			<p className='text-gray-300 text-sm mb-2 bg-gray-500 rounded-md'>
				Mô tả: {build.description || "Không có mô tả"}
			</p>
			<p className='text-gray-300 text-sm mb-3 bg-gray-500 rounded-md'>
				Người tạo: {build.creator || "Ẩn danh"}
			</p>
			<div className='flex gap-2'>
				<button
					onClick={onEdit}
					className='flex-1 px-3 py-2 bg-green-600 rounded-md hover:bg-yellow-700 transition duration-150 transform hover:scale-105'
				>
					Cập nhật
				</button>
				<button
					onClick={onDelete}
					className='flex-1 px-3 py-2 bg-red-600 rounded-md hover:bg-red-700 transition duration-150 transform hover:scale-105'
				>
					Xóa
				</button>
			</div>
		</div>
	);
}

export default memo(BuildCard);
