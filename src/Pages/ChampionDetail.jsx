import { useState, useCallback, useMemo } from "react";
import { memo } from "react";
import { Link, useParams } from "react-router-dom";
import iconRegion from "../Data/iconRegions.json";
import powers from "../Data/powers-vi_vn.json";
import items from "../Data/items-vi_vn.json";
import relics from "../Data/relics-vi_vn.json";
import chamPOC from "../Data/chamPOC.json";
import championVideoLinks from "../Data/linkChampionVideo.json";

// Memoized lookup functions
const findRegionIconLink = regionIcon => {
	return (
		iconRegion.find(item => item.name === regionIcon)?.iconAbsolutePath ||
		"/images/placeholder.png"
	);
};

const findPower = powerIcon => {
	return (
		powers.find(item => item.name === powerIcon)?.assetFullAbsolutePath ||
		"/images/placeholder.png"
	);
};

const findItem = itemIcon => {
	return (
		items.find(item => item.name === itemIcon)?.assetAbsolutePath ||
		"/images/placeholder.png"
	);
};

const findRelic = relicIcon => {
	return (
		relics.find(item => item.name === relicIcon)?.assetAbsolutePath ||
		"/images/placeholder.png"
	);
};

function ChampionDetail() {
	const { name } = useParams();

	// Initialize favorite state from localStorage
	const [isFavorited, setIsFavorited] = useState(() => {
		const favorites = JSON.parse(
			localStorage.getItem("championFavorites") || "{}"
		);
		return !!favorites[name];
	});

	// Toggle favorite state and update localStorage
	const toggleFavorite = useCallback(() => {
		setIsFavorited(prev => {
			const newState = !prev;
			const favorites = JSON.parse(
				localStorage.getItem("championFavorites") || "{}"
			);
			favorites[name] = newState ? true : undefined;
			localStorage.setItem("championFavorites", JSON.stringify(favorites));
			return newState;
		});
	}, [name]);

	// Memoize champion and video link lookups
	const champion = useMemo(
		() => chamPOC.find(champ => champ.name === name),
		[name]
	);
	const videoLink = useMemo(
		() => championVideoLinks.find(video => video.name === name)?.link || "",
		[name]
	);

	if (!champion) {
		return (
			<div className='p-6 text-white'>
				Không tìm thấy thông tin tướng. Name: {name}
			</div>
		);
	}

	return (
		<div className='relative mx-auto max-w-[1200px] p-6 bg-gray-900 rounded-lg mt-10 text-white'>
			<div className='flex flex-col md:flex-row gap-6 bg-gray-800 rounded-md'>
				<img
					className='h-[300px] object-contain rounded-lg'
					src={
						champion.assets[0]?.M.gameAbsolutePath.S ||
						"/images/placeholder.png"
					}
					alt={champion.name || "Unknown Champion"}
					loading='lazy'
				/>
				<div className='flex-1'>
					<div className='flex justify-between items-center'>
						<div className='text-4xl font-bold mb-4'>{champion.name}</div>
						<button
							onClick={toggleFavorite}
							className='text-yellow-400 text-2xl focus:outline-none'
							aria-label={`Toggle favorite for ${champion.name}`}
						>
							{isFavorited ? "★" : "☆"}
						</button>
					</div>
					<div className='flex'>
						{champion.regions?.length > 0 && (
							<div className='flex'>
								{champion.regions.map((region, index) => (
									<img
										className='w-[56px]'
										key={index}
										src={findRegionIconLink(region)}
										alt={region || "Unknown Region"}
										loading='lazy'
									/>
								))}
							</div>
						)}
					</div>
					{champion.note && <p className='text-xl mb-1'>{champion.note}</p>}
				</div>
			</div>

			<h2 className='text-3xl font-semibold mt-6'>Video giới thiệu</h2>
			<div>
				<h2 className='text-lg font-semibold my-1'>
					Đăng ký kênh Evin LoR tại:{" "}
					<a
						href='https://www.youtube.com/@Evin0126/'
						target='_blank'
						rel='noopener noreferrer'
						className='underline text-blue-400'
					>
						https://www.youtube.com/@Evin0126/
					</a>
				</h2>
				<div className='flex justify-center mb-6 p-10 bg-gray-800 md:h-[603px]'>
					<iframe
						width='100%'
						height='100%'
						src={videoLink}
						title={`Video giới thiệu ${champion.name}`}
						frameBorder='0'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
						referrerPolicy='strict-origin-when-cross-origin'
						allowFullScreen
						loading='lazy'
					></iframe>
				</div>
			</div>

			<h2 className='text-3xl font-semibold pl-1 m-5'>Sức mạnh khuyên dùng</h2>
			{champion.defaultAdventurePower?.length > 0 && (
				<div className='flex flex-wrap justify-center bg-gray-700 rounded-md'>
					{champion.defaultAdventurePower.map((defaultPower, index) => (
						<img
							className='w-[360px]'
							key={index}
							src={findPower(defaultPower.S)}
							alt={defaultPower.S || "Unknown Power"}
							loading='lazy'
						/>
					))}
				</div>
			)}

			<h2 className='text-3xl font-semibold m-5'>Vật phẩm khuyên dùng</h2>
			{champion.defaultItems?.length > 0 && (
				<div className='flex flex-wrap justify-center bg-gray-700 rounded-md'>
					{champion.defaultItems.map((item, index) => (
						<img
							className='w-[120px]'
							key={index}
							src={findItem(item.S)}
							alt={item.S || "Unknown Item"}
							loading='lazy'
						/>
					))}
				</div>
			)}

			<h2 className='text-3xl font-semibold m-5'>Chòm sao</h2>
			{champion.defaultPowers?.length > 0 && (
				<div className='flex flex-wrap justify-center bg-gray-700 rounded-md'>
					{champion.defaultPowers.map((defaultPower, index) => (
						<img
							className='w-[360px]'
							key={index}
							src={findPower(defaultPower.S)}
							alt={defaultPower.S || "Unknown Power"}
							loading='lazy'
						/>
					))}
				</div>
			)}

			<h2 className='text-3xl font-semibold m-5'>Bộ cổ vật</h2>
			<div className='flex flex-wrap p-4 justify-center bg-gray-800 rounded-md mt-5'>
				{[1, 2, 3, 4, 5, 6].map(set => (
					<div className='bg-gray-700 rounded-2xl m-1' key={set}>
						<h2 className='text-xl font-semibold ml-3'>Bộ cổ vật {set}</h2>
						{champion[`defaultRelicsSet${set}`]?.length > 0 && (
							<div className='flex flex-wrap'>
								{champion[`defaultRelicsSet${set}`].map((relic, index) => (
									<img
										className='w-[120px]'
										key={index}
										src={findRelic(relic.S)}
										alt={relic.S || "Unknown Relic"}
										loading='lazy'
									/>
								))}
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default memo(ChampionDetail);
