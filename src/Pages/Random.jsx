import { useState, useMemo, useCallback } from "react";
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
		].sort();
	}, []);
	const rarities = useMemo(() => ["Tất cả", "THƯỜNG", "HIẾM", "SỬ THI"], []);

	// Memoized event handlers
	const handleRegionChange = useCallback(
		e => {
			const value = e.target.value;
			setSelectedRegion(value);
			setDisplayChampion(null); // Reset displayChampion khi thay đổi region
			saveToLocalStorage("randomSelectedRegion", value);
		},
		[saveToLocalStorage]
	);

	const handleRarityChange = useCallback(
		e => {
			const value = e.target.value;
			setSelectedRarity(value);
			setDisplayRelic(null); // Reset displayRelic khi thay đổi rarity
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

	return (
		<div className='relative mx-auto max-w-[1200px] p-4 sm:p-6 bg-gray-900 rounded-lg mt-10 text-white'>
			<h1 className='text-2xl sm:text-3xl font-bold mb-6 text-center'>
				Random Tướng và Cổ Vật
			</h1>

			{/* Bộ lọc và nút Random Tướng */}
			<div className='mb-8'>
				<h2 className='text-lg sm:text-2xl font-semibold mb-4'>Random Tướng</h2>
				<div className='flex flex-col sm:flex-row gap-4 items-center'>
					<select
						className='p-2 bg-gray-800 rounded-md text-white w-full sm:w-auto'
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
						className='p-2 bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-600 w-full sm:w-auto'
						onClick={handleRandomChampion}
						disabled={isSpinningChampion || isSpinningRelic}
						aria-label={isSpinningChampion ? "Đang quay tướng" : "Random Tướng"}
					>
						{isSpinningChampion ? "Đang quay..." : "Random Tướng"}
					</button>
				</div>
				{displayChampion ? (
					<div className='mt-4 flex flex-col sm:flex-row gap-4 bg-gray-800 p-4 rounded-md justify-center'>
						<img
							className='w-full max-w-[150px] sm:max-w-[200px] h-auto object-contain rounded-lg'
							src={
								displayChampion.assets[0]?.M.gameAbsolutePath.S ||
								"/images/placeholder.png"
							}
							alt={displayChampion.name || "Unknown Champion"}
							loading='lazy'
						/>
						<div>
							<h3 className='text-base sm:text-xl font-bold'>
								{displayChampion.name || "Unknown Champion"}
							</h3>
						</div>
					</div>
				) : (
					<p className='mt-4 text-center text-sm sm:text-base'>
						Chưa chọn tướng. Nhấn "Random Tướng" để bắt đầu!
					</p>
				)}
			</div>

			{/* Bộ lọc và nút Random Cổ Vật */}
			<div className='mb-8'>
				<h2 className='text-lg sm:text-2xl font-semibold mb-4'>
					Random Cổ Vật
				</h2>
				<div className='flex flex-col sm:flex-row gap-4 items-center'>
					<select
						className='p-2 bg-gray-800 rounded-md text-white w-full sm:w-auto'
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
						className='p-2 bg-blue-600 hover:bg-blue-700 rounded-md disabled:bg-gray-600 w-full sm:w-auto'
						onClick={handleRandomRelic}
						disabled={isSpinningChampion || isSpinningRelic}
						aria-label={isSpinningRelic ? "Đang quay cổ vật" : "Random Cổ Vật"}
					>
						{isSpinningRelic ? "Đang quay..." : "Random Cổ Vật"}
					</button>
				</div>
				{displayRelic ? (
					<div className='mt-4 flex flex-col sm:flex-row gap-4 bg-gray-800 p-4 rounded-md justify-center'>
						<img
							className='w-full max-w-[100px] sm:max-w-[120px] h-auto object-contain rounded-lg'
							src={findRelic(displayRelic.name) || "/images/placeholder.png"}
							alt={displayRelic.name || "Unknown Relic"}
							loading='lazy'
						/>
						<div>
							<h3 className='text-base sm:text-xl font-bold'>
								{displayRelic.name || "Unknown Relic"}
							</h3>
							<p className='mt-2 text-sm sm:text-base'>
								Độ hiếm: {displayRelic.rarity || "Unknown"}
							</p>
						</div>
					</div>
				) : (
					<p className='mt-4 text-center text-sm sm:text-base'>
						Chưa chọn cổ vật. Nhấn "Random Cổ Vật" để bắt đầu!
					</p>
				)}
			</div>
		</div>
	);
}

export default memo(Random);
