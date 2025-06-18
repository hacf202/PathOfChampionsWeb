import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { memo } from "react";
import ChampionCard from "./ChampionCard";
import chamPOC from "../Data/chamPOC.json";

function Champions() {
	const [searchTerm, setSearchTerm] = useState(
		() => localStorage.getItem("championsSearchTerm") || ""
	);
	const [selectedRegion, setSelectedRegion] = useState(
		() => localStorage.getItem("championsSelectedRegion") || ""
	);
	const [sortOrder, setSortOrder] = useState(
		() => localStorage.getItem("championsSortOrder") || "asc"
	);

	const saveToLocalStorage = useCallback((key, value) => {
		localStorage.setItem(key, value);
	}, []);

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

	const uniqueRegions = useMemo(() => {
		return [...new Set(chamPOC.flatMap(champ => champ.regions || []))].sort();
	}, []);

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
		<div className='relative w-full max-w-[1200px] mx-auto bg-gray-900'>
			<div className='mt-6 p-4 sm:p-6'>
				{/* Bộ lọc và tìm kiếm */}
				<div className='mb-6 flex flex-col gap-4 bg-gray-800 p-4 rounded-lg'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<select
							value={selectedRegion}
							onChange={handleRegionChange}
							className='p-2 rounded-md text-black w-full sm:w-auto'
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
							className='p-2 rounded-md text-black w-full sm:w-auto'
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
						className='p-2 rounded-md text-black w-full'
						aria-label='Tìm kiếm tướng theo tên'
					/>
				</div>

				<div className='pt-4 flex flex-wrap rounded-lg bg-gray-800 items-center justify-center'>
					<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full'>
						{sortedChampions.map((champ, index) => (
							<Link
								to={`/champion/${champ.name}`}
								key={index}
								className='w-full'
							>
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
