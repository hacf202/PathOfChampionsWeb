import { useState, useEffect, useMemo, useCallback } from "react";
import { memo } from "react";
import chamPOC from "../Data/chamPOC.json";
import relics from "../Data/relics-vi_vn.json";
import Footer from "../Components/Footer";

// Memoized relic lookup
const findRelic = relicIcon => {
	return (
		relics.find(item => item.name === relicIcon)?.assetAbsolutePath ||
		"/images/placeholder.png"
	);
};

function Random() {
	// Initialize state from localStorage
	const [selectedRegion, setSelectedRegion] = useState(
		() => localStorage.getItem("randomSelectedRegion") || "Tất cả"
	);
	const [selectedRarity, setSelectedRarity] = useState(
		() => localStorage.getItem("randomSelectedRarity") || "Tất cả"
	);
	const [displayChampion, setDisplayChampion] = useState(null);
	const [displayRelic, setDisplayRelic] = useState(null);
	const [isSpinningChampion, setIsSpinningChampion] = useState(false);
	const [isSpinningRelic, setIsSpinningRelic] = useState(false);

	// Save state to localStorage
	const saveToLocalStorage = useCallback((key, value) => {
		localStorage.setItem(key, value);
	}, []);

	// Memoize regions and rarities
	const regions = useMemo(() => {
		return [
			"Tất cả",
			...new Set(chamPOC.flatMap(champ => champ.regions || [])),
		];
	}, []);
	const rarities = useMemo(() => ["Tất cả", "THƯỜNG", "HIẾM", "SỬ THI"], []);

	// Memoized event handlers
	const handleRegionChange = useCallback(
		e => {
			const value = e.target.value;
			setSelectedRegion(value);
			saveToLocalStorage("randomSelectedRegion", value);
		},
		[saveToLocalStorage]
	);

	const handleRarityChange = useCallback(
		e => {
			const value = e.target.value;
			setSelectedRarity(value);
			saveToLocalStorage("randomSelectedRarity", value);
		},
		[saveToLocalStorage]
	);

	// Random champion handler
	const handleRandomChampion = useCallback(() => {
		setIsSpinningChampion(true);
		const filteredChampions =
			selectedRegion === "Tất cả"
				? chamPOC
				: chamPOC.filter(champ => champ.regions?.includes(selectedRegion));

		if (filteredChampions.length === 0) {
			setDisplayChampion(null);
			setIsSpinningChampion(false);
			return;
		}

		const interval = setInterval(() => {
			const randomIndex = Math.floor(Math.random() * filteredChampions.length);
			setDisplayChampion(filteredChampions[randomIndex]);
		}, 200);

		setTimeout(() => {
			clearInterval(interval);
			const randomIndex = Math.floor(Math.random() * filteredChampions.length);
			setDisplayChampion(filteredChampions[randomIndex]);
			setIsSpinningChampion(false);
		}, 5000);
	}, [selectedRegion]);

	// Random relic handler
	const handleRandomRelic = useCallback(() => {
		setIsSpinningRelic(true);
		const filteredRelics =
			selectedRarity === "Tất cả"
				? relics
				: relics.filter(relic => relic.rarity === selectedRarity);

		if (filteredRelics.length === 0) {
			setDisplayRelic(null);
			setIsSpinningRelic(false);
			return;
		}

		const interval = setInterval(() => {
			const randomIndex = Math.floor(Math.random() * filteredRelics.length);
			setDisplayRelic(filteredRelics[randomIndex]);
		}, 200);

		setTimeout(() => {
			clearInterval(interval);
			const randomIndex = Math.floor(Math.random() * filteredRelics.length);
			setDisplayRelic(filteredRelics[randomIndex]);
			setIsSpinningRelic(false);
		}, 5000);
	}, [selectedRarity]);

	// Initial random selection on mount
	useEffect(() => {
		handleRandomChampion();
		handleRandomRelic();
	}, [handleRandomChampion, handleRandomRelic]);

	return (
		<div className='relative mx-auto max-w-[1200px] p-6 bg-gray-900 rounded-lg mt-10 text-white'>
			<h1 className='text-4xl font-bold mb-6 text-center'>
				Random Tướng và Cổ Vật
			</h1>

			{/* Bộ lọc và nút Random Tướng */}
			<div className='mb-8'>
				<h2 className='text-2xl font-semibold mb-4'>Random Tướng</h2>
				<div className='flex flex-col md:flex-row gap-4 items-center'>
					<select
						className='p-2 bg-gray-800 rounded-md text-white'
						value={selectedRegion}
						onChange={handleRegionChange}
						aria-label='Chọn khu vực của tướng'
					>
						{regions.map((region, index) => (
							<option key={index} value={region}>
								{region}
							</option>
						))}
					</select>
					<button
						className='p-2 bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-600'
						onClick={handleRandomChampion}
						disabled={isSpinningChampion || isSpinningRelic}
						aria-label={isSpinningChampion ? "Đang quay tướng" : "Random Tướng"}
					>
						{isSpinningChampion ? "Đang quay..." : "Random Tướng"}
					</button>
				</div>
				{displayChampion && (
					<div className='mt-4 flex flex-col md:flex-row gap-4 bg-gray-800 p-4 rounded-md justify-center'>
						<img
							className='h-[200px] object-contain rounded-lg'
							src={
								displayChampion.assets[0]?.M.gameAbsolutePath.S ||
								"/images/placeholder.png"
							}
							alt={displayChampion.name || "Unknown Champion"}
							loading='lazy'
						/>
						<div>
							<h3 className='text-xl font-bold'>
								{displayChampion.name || "Unknown Champion"}
							</h3>
						</div>
					</div>
				)}
			</div>

			{/* Bộ lọc và nút Random Cổ Vật */}
			<div className='mb-8'>
				<h2 className='text-2xl font-semibold mb-4'>Random Cổ Vật</h2>
				<div className='flex flex-col md:flex-row gap-4 items-center'>
					<select
						className='p-2 bg-gray-800 rounded-md text-white'
						value={selectedRarity}
						onChange={handleRarityChange}
						aria-label='Chọn độ hiếm của cổ vật'
					>
						{rarities.map((rarity, index) => (
							<option key={index} value={rarity}>
								{rarity}
							</option>
						))}
					</select>
					<button
						className='p-2 bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-600'
						onClick={handleRandomRelic}
						disabled={isSpinningChampion || isSpinningRelic}
						aria-label={isSpinningRelic ? "Đang quay cổ vật" : "Random Cổ Vật"}
					>
						{isSpinningRelic ? "Đang quay..." : "Random Cổ Vật"}
					</button>
				</div>
				{displayRelic && (
					<div className='mt-4 flex flex-col md:flex-row gap-4 bg-gray-800 p-4 rounded-md justify-center'>
						<img
							className='h-[120px] object-contain rounded-lg'
							src={findRelic(displayRelic.name) || "/images/placeholder.png"}
							alt={displayRelic.name || "Unknown Relic"}
							loading='lazy'
						/>
						<div>
							<h3 className='text-xl font-bold'>
								{displayRelic.name || "Unknown Relic"}
							</h3>
							<p className='mt-2'>
								Độ hiếm: {displayRelic.rarity || "Unknown"}
							</p>
						</div>
					</div>
				)}
			</div>

			<Footer />
		</div>
	);
}

export default memo(Random);
