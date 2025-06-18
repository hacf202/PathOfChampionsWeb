import { useState, useMemo, useCallback } from "react";
import { memo } from "react";
import items from "../Data/items-vi_vn.json";

function Items() {
	// Initialize state from localStorage
	const [searchTerm, setSearchTerm] = useState(
		() => localStorage.getItem("itemsSearchTerm") || ""
	);
	const [selectedRarity, setSelectedRarity] = useState(
		() => localStorage.getItem("itemsSelectedRarity") || ""
	);
	const [sortOrder, setSortOrder] = useState(
		() => localStorage.getItem("itemsSortOrder") || "asc"
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
			saveToLocalStorage("itemsSearchTerm", value);
		},
		[saveToLocalStorage]
	);

	const handleRarityChange = useCallback(
		e => {
			const value = e.target.value;
			setSelectedRarity(value);
			saveToLocalStorage("itemsSelectedRarity", value);
		},
		[saveToLocalStorage]
	);

	const handleSortChange = useCallback(
		e => {
			const value = e.target.value;
			setSortOrder(value);
			saveToLocalStorage("itemsSortOrder", value);
		},
		[saveToLocalStorage]
	);

	// Memoize unique rarities
	const uniqueRarities = useMemo(() => {
		return [...new Set(items.map(item => item.rarity || ""))].sort();
	}, []);

	// Memoize filtered items
	const filteredItems = useMemo(() => {
		return items.filter(item => {
			const matchesSearch = (item.name || "")
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesRarity = !selectedRarity || item.rarity === selectedRarity;
			return matchesSearch && matchesRarity;
		});
	}, [searchTerm, selectedRarity]);

	// Memoize rarity order
	const rarityOrder = useMemo(
		() => ({
			"ĐẶC BIỆT": 0,
			THƯỜNG: 1,
			HIẾM: 2,
			"SỬ THI": 3,
		}),
		[]
	);

	// Memoize sorted items
	const sortedItems = useMemo(() => {
		return [...filteredItems].sort((a, b) => {
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
	}, [filteredItems, sortOrder, rarityOrder]);

	return (
		<div className='relative mx-auto max-w-[1200px] p-4 sm:p-6 bg-gray-900 rounded-lg mt-10 text-white'>
			<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Items</h1>
			{/* Bộ lọc, tìm kiếm và sắp xếp */}
			<div className='mb-6 flex flex-col gap-4 bg-gray-800 p-4 rounded-lg'>
				<div className='flex flex-col sm:flex-row gap-4'>
					<select
						value={selectedRarity}
						onChange={handleRarityChange}
						className='p-2 rounded-md text-black w-full sm:w-auto'
						aria-label='Chọn độ hiếm của vật phẩm'
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
						className='p-2 rounded-md text-black w-full sm:w-auto'
						aria-label='Chọn thứ tự sắp xếp'
					>
						<option value='asc'>A-Z</option>
						<option value='desc'>Z-A</option>
						<option value='rarityAsc'>Common - Epic</option>
						<option value='rarityDesc'>Epic - Common</option>
					</select>
				</div>
				<input
					type='text'
					placeholder='Tìm kiếm theo tên...'
					value={searchTerm}
					onChange={handleSearchChange}
					className='p-2 rounded-md text-black w-full'
					aria-label='Tìm kiếm vật phẩm theo tên'
				/>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
				{sortedItems.map((item, index) => (
					<div key={index} className='p-4 bg-gray-800 rounded-lg'>
						<img
							src={item.assetFullAbsolutePath || "/images/placeholder.png"}
							alt={item.name || "Unknown Item"}
							className='w-full h-auto object-cover rounded-md'
							loading='lazy'
						/>
						{/* <p className='mt-2 text-center'>{item.name || "Unknown Item"}</p> */}
					</div>
				))}
			</div>
		</div>
	);
}

export default memo(Items);
