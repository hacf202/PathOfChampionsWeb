import { useState, useMemo, useCallback, useEffect } from "react";
import { memo } from "react";
import relics from "../Data/relics-vi_vn.json";

function Relics() {
	// Initialize state from localStorage or default to empty values
	const [searchTerm, setSearchTerm] = useState(
		() => localStorage.getItem("relicsSearchTerm") || ""
	);
	const [selectedRarity, setSelectedRarity] = useState(
		() => localStorage.getItem("relicsSelectedRarity") || ""
	);
	const [sortOrder, setSortOrder] = useState(
		() => localStorage.getItem("relicsSortOrder") || "asc"
	);

	// Save state to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("relicsSearchTerm", searchTerm);
	}, [searchTerm]);

	useEffect(() => {
		localStorage.setItem("relicsSelectedRarity", selectedRarity);
	}, [selectedRarity]);

	useEffect(() => {
		localStorage.setItem("relicsSortOrder", sortOrder);
	}, [sortOrder]);

	// Memoize unique rarities
	const uniqueRarities = useMemo(() => {
		return [...new Set(relics.map(relic => relic.rarity || ""))].sort();
	}, []);

	// Memoize filtered relics
	const filteredRelics = useMemo(() => {
		return relics.filter(relic => {
			const matchesSearch = (relic.name || "")
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesRarity = !selectedRarity || relic.rarity === selectedRarity;
			return matchesSearch && matchesRarity;
		});
	}, [searchTerm, selectedRarity]);

	// Memoize rarity order for sorting
	const rarityOrder = useMemo(
		() => ({
			THƯỜNG: 0,
			HIẾM: 1,
			"SỬ THI": 2,
		}),
		[]
	);

	// Memoize sorted relics
	const sortedRelics = useMemo(() => {
		return [...filteredRelics].sort((a, b) => {
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
	}, [filteredRelics, sortOrder, rarityOrder]);

	// Memoized event handlers
	const handleSearchChange = useCallback(e => {
		setSearchTerm(e.target.value);
	}, []);

	const handleRarityChange = useCallback(e => {
		setSelectedRarity(e.target.value);
	}, []);

	const handleSortChange = useCallback(e => {
		setSortOrder(e.target.value);
	}, []);

	return (
		<div className='relative mx-auto max-w-[1200px] p-4 sm:p-6 bg-gray-900 rounded-lg mt-10 text-white'>
			<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Relics</h1>
			{/* Bộ lọc, tìm kiếm và sắp xếp */}
			<div className='mb-6 flex flex-col gap-4 bg-gray-800 p-4 rounded-lg'>
				<div className='flex flex-col sm:flex-row gap-4'>
					<select
						value={selectedRarity}
						onChange={handleRarityChange}
						className='p-2 rounded-md text-black w-full sm:w-auto'
						aria-label='Chọn độ hiếm của cổ vật'
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
					aria-label='Tìm kiếm cổ vật theo tên'
				/>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
				{sortedRelics.map((relic, index) => (
					<div key={index} className='p-4 bg-gray-800 rounded-lg'>
						<img
							src={relic.assetFullAbsolutePath || "/images/placeholder.png"}
							alt={relic.name || "Unknown Relic"}
							className='w-full h-auto object-cover rounded-md'
							loading='lazy'
						/>
						{/* <p className='mt-2 text-center'>{relic.name || "Unknown Relic"}</p> */}
					</div>
				))}
			</div>
		</div>
	);
}

export default memo(Relics);
