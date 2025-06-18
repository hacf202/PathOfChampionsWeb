import { useState, useMemo, useCallback } from "react";
import { memo } from "react";
import powers from "../Data/powers-vi_vn.json";

function Powers() {
	// Initialize state from localStorage
	const [searchTerm, setSearchTerm] = useState(
		() => localStorage.getItem("powersSearchTerm") || ""
	);
	const [selectedRarity, setSelectedRarity] = useState(
		() => localStorage.getItem("powersSelectedRarity") || ""
	);
	const [sortOrder, setSortOrder] = useState(
		() => localStorage.getItem("powersSortOrder") || "asc"
	);

	// Save state to localStorage
	const saveToLocalStorage = useCallback((key, value) => {
		localStorage.setItem(key, value);
	}, []);

	// Memoized event handlers
	const handleSearchChange = useCallback(
		e => {
			const value = e.target.value;
			setSearchTerm(value);
			saveToLocalStorage("powersSearchTerm", value);
		},
		[saveToLocalStorage]
	);

	const handleRarityChange = useCallback(
		e => {
			const value = e.target.value;
			setSelectedRarity(value);
			saveToLocalStorage("powersSelectedRarity", value);
		},
		[saveToLocalStorage]
	);

	const handleSortChange = useCallback(
		e => {
			const value = e.target.value;
			setSortOrder(value);
			saveToLocalStorage("powersSortOrder", value);
		},
		[saveToLocalStorage]
	);

	// Memoize unique rarities
	const uniqueRarities = useMemo(() => {
		return [...new Set(powers.map(power => power.rarity || ""))].sort();
	}, []);

	// Memoize filtered powers
	const filteredPowers = useMemo(() => {
		return powers.filter(power => {
			const matchesSearch = (power.name || "")
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesRarity = !selectedRarity || power.rarity === selectedRarity;
			return matchesSearch && matchesRarity;
		});
	}, [searchTerm, selectedRarity]);

	// Memoize rarity order
	const rarityOrder = useMemo(
		() => ({
			THƯỜNG: 0,
			HIẾM: 1,
			"SỬ THI": 2,
			"HUYỀN THOẠI": 3,
		}),
		[]
	);

	// Memoize sorted powers
	const sortedPowers = useMemo(() => {
		return [...filteredPowers].sort((a, b) => {
			const rarityA = rarityOrder[a.rarity] || 0;
			const rarityB = rarityOrder[b.rarity] || 0;
			if (sortOrder === "asc") {
				return (a.name || "").localeCompare(b.name || "");
			} else if (sortOrder === "desc") {
				return (b.name || "").localeCompare(a.name || "");
			} else if (sortOrder === "rarityAsc") {
				return rarityA - rarityB;
			} else if (sortOrder === "rarityDesc") {
				return rarityB - rarityA;
			}
			return 0;
		});
	}, [filteredPowers, sortOrder, rarityOrder]);

	return (
		<div className='relative mx-auto max-w-[1200px] p-6 bg-gray-900 rounded-lg mt-10 text-white'>
			<h1 className='text-3xl font-bold mb-6'>Powers</h1>
			{/* Bộ lọc, tìm kiếm và sắp xếp */}
			<div className='mb-6 flex flex-col md:flex-row gap-4 bg-gray-800 p-4 rounded-lg justify-between'>
				<div className='flex gap-4'>
					<select
						value={selectedRarity}
						onChange={handleRarityChange}
						className='p-2 rounded-md text-black'
						aria-label='Chọn độ hiếm của sức mạnh'
					>
						<option value=''>Tất cả độ hiếm</option>
						{uniqueRarities.map((rarity, index) => (
							<option key={index} value={rarity}>
								{rarity}
							</option>
						))}
					</select>
					<select
						value={sortOrder}
						onChange={handleSortChange}
						className='p-2 rounded-md text-black'
						aria-label='Chọn thứ tự sắp xếp'
					>
						<option value='asc'>A-Z</option>
						<option value='desc'>Z-A</option>
						<option value='rarityAsc'>Common - Legendary</option>
						<option value='rarityDesc'>Legendary - Common</option>
					</select>
				</div>
				<input
					type='text'
					placeholder='Tìm kiếm theo tên...'
					value={searchTerm}
					onChange={handleSearchChange}
					className='p-2 rounded-md text-black'
					aria-label='Tìm kiếm sức mạnh theo tên'
				/>
			</div>

			<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
				{sortedPowers.map((power, index) => (
					<div key={index} className='p-4 bg-gray-800 rounded-lg'>
						<img
							src={power.assetFullAbsolutePath || "/images/placeholder.png"}
							alt={power.name || "Unknown Power"}
							className='w-full h-auto object-cover rounded-md'
							loading='lazy'
						/>
						{/* <p className='mt-2 text-center'>{power.name || "Unknown Power"}</p> */}
					</div>
				))}
			</div>
		</div>
	);
}

export default memo(Powers);
