import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { memo } from "react";
import ChampionCard from "./ChampionCard";
import chamPOC from "../Data/chamPOC.json";

function Champions() {
	// Initialize state from localStorage
	const [searchTerm, setSearchTerm] = useState(
		() => localStorage.getItem("championsSearchTerm") || ""
	);
	const [selectedRegion, setSelectedRegion] = useState(
		() => localStorage.getItem("championsSelectedRegion") || ""
	);
	const [sortOrder, setSortOrder] = useState(
		() => localStorage.getItem("championsSortOrder") || "asc"
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
			saveToLocalStorage("championsSearchTerm", value);
		},
		[saveToLocalStorage]
	);

	const handleRegionChange = useCallback(
		e => {
			const value = e.target.value;
			setSelectedRegion(value);
			saveToLocalStorage("championsSelectedRegion", value);
		},
		[saveToLocalStorage]
	);

	const handleSortChange = useCallback(
		e => {
			const value = e.target.value;
			setSortOrder(value);
			saveToLocalStorage("championsSortOrder", value);
		},
		[saveToLocalStorage]
	);

	// Memoize unique regions
	const uniqueRegions = useMemo(() => {
		return [...new Set(chamPOC.flatMap(champ => champ.regions || []))].sort();
	}, []);

	// Memoize filtered champions
	const filteredChampions = useMemo(() => {
		return chamPOC.filter(champ => {
			const matchesSearch = (champ.name || "")
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesRegion =
				!selectedRegion ||
				(champ.regions && champ.regions.includes(selectedRegion));
			return matchesSearch && matchesRegion;
		});
	}, [searchTerm, selectedRegion]);

	// Memoize sorted champions
	const sortedChampions = useMemo(() => {
		return [...filteredChampions].sort((a, b) => {
			const nameA = a.name || "";
			const nameB = b.name || "";
			return sortOrder === "asc"
				? nameA.localeCompare(nameB)
				: nameB.localeCompare(nameA);
		});
	}, [filteredChampions, sortOrder]);

	return (
		<div className='relative w-full min-h-screen bg-gray-900'>
			<div className='mt-10 p-3 mx-auto max-w-[1200px]'>
				{/* Bộ lọc và tìm kiếm */}
				<div className='mb-6 flex flex-col md:flex-row gap-4 bg-gray-800 p-4 rounded-lg justify-between px-14'>
					<div className='flex gap-4'>
						<select
							value={selectedRegion}
							onChange={handleRegionChange}
							className='p-2 rounded-md text-black'
							aria-label='Chọn khu vực của tướng'
						>
							<option value=''>Tất cả khu vực</option>
							{uniqueRegions.map((region, index) => (
								<option key={index} value={region}>
									{region}
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
						</select>
					</div>
					<input
						type='text'
						placeholder='Tìm kiếm theo tên...'
						value={searchTerm}
						onChange={handleSearchChange}
						className='p-2 rounded-md text-black'
						aria-label='Tìm kiếm tướng theo tên'
					/>
				</div>

				<div className='pt-6 flex flex-wrap rounded-[8px] bg-gray-800 items-center justify-center min-h-screen'>
					<div className='flex flex-wrap gap-[5px] justify-center'>
						{sortedChampions.map((champ, index) => (
							<Link to={`/champion/${champ.name}`} key={index}>
								<ChampionCard champion={champ} />
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default memo(Champions);
