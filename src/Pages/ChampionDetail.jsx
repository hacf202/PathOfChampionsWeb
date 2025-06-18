import { Link, useParams } from "react-router-dom";
import iconRegion from "../Data/iconRegions.json";
import powers from "../Data/powers-vi_vn.json";
import items from "../Data/items-vi_vn.json";
import relics from "../Data/relics-vi_vn.json";
import chamPOC from "../Data/chamPOC.json";
import championVideoLinks from "../Data/linkChampionVideo.json";

function findRegionIconLink(regionIcon) {
	const item = iconRegion.find(item => item.name === regionIcon);
	return item?.iconAbsolutePath || "default-icon.png";
}

function findPower(powerIcon) {
	const item = powers.find(item => item.name === powerIcon);
	return item?.assetFullAbsolutePath;
}

function findItem(itemIcon) {
	const item = items.find(item => item.name === itemIcon);
	return item?.assetAbsolutePath;
}

function findRelic(relicIcon) {
	const item = relics.find(item => item.name === relicIcon);
	return item?.assetAbsolutePath;
}

function ChampionDetail() {
	const { name } = useParams();
	console.log("Name from URL:", name);
	console.log("chamPOC data:", chamPOC);

	const champion = chamPOC.find(champ => champ.name === name);

	if (!champion) {
		console.log("No champion found for name:", name);
		console.log(
			"Available champion names:",
			chamPOC.map(champ => champ.name)
		);
		return (
			<div className='p-4 sm:p-6 text-white'>
				Không tìm thấy thông tin tướng. Name: {name}
			</div>
		);
	}

	const videoLink =
		championVideoLinks.find(video => video.name === name)?.link || "";

	return (
		<div className='relative mx-auto max-w-[1200px] p-4 sm:p-6 bg-gray-900 rounded-lg mt-10 text-white'>
			<div className='flex flex-col md:flex-row gap-4 bg-gray-800 rounded-md'>
				<img
					className='w-full h-auto max-h-[200px] sm:max-h-[300px] object-contain rounded-lg'
					src={champion.assets[0].M.gameAbsolutePath.S}
					alt={champion.name}
				/>
				<div className='flex-1'>
					<div className='flex flex-col sm:flex-row sm:justify-between'>
						<div className='text-2xl sm:text-4xl font-bold mb-4'>
							{champion.name}
						</div>
						{/* Regions */}
						<div className='flex flex-wrap gap-2'>
							{champion.regions && champion.regions.length > 0 && (
								<div className='flex flex-wrap gap-2'>
									{champion.regions.map((region, index) => (
										<img
											className='w-8 sm:w-12'
											key={index}
											src={findRegionIconLink(region)}
											alt={region}
										/>
									))}
								</div>
							)}
						</div>
					</div>
					{/* Mô tả (note) */}
					{champion.note && (
						<p className='text-base sm:text-xl mb-4'>{champion.note}</p>
					)}
				</div>
			</div>

			{/* Nhúng video YouTube */}
			<h2 className='text-xl sm:text-3xl font-semibold mt-6'>
				Video giới thiệu
			</h2>
			<div>
				<h2 className='text-sm sm:text-lg font-semibold my-1'>
					Đăng ký kênh Evin LoR tại:{" "}
					<a
						href='https://www.youtube.com/@Evin0126/'
						target='_blank'
						className='underline text-blue-400'
					>
						https://www.youtube.com/@Evin0126/
					</a>
				</h2>

				<div className='flex justify-center mb-6 p-4 bg-gray-800 aspect-video'>
					<iframe
						width='100%'
						height='100%'
						src={`${videoLink}`}
						title='YouTube video player'
						frameBorder='0'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
						referrerPolicy='strict-origin-when-cross-origin'
						allowFullScreen
					></iframe>
				</div>
			</div>

			{/* Default Adventure Powers */}
			<h2 className='text-xl sm:text-3xl font-semibold pl-1 m-5'>
				Sức mạnh khuyên dùng
			</h2>
			{champion.defaultAdventurePower &&
				champion.defaultAdventurePower.length > 0 && (
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-700 rounded-md p-4'>
						{champion.defaultAdventurePower.map((defaultPower, index) => (
							<img
								className='w-full max-w-[360px] h-auto'
								key={index}
								src={findPower(defaultPower.S)}
								alt={defaultPower.S}
							/>
						))}
					</div>
				)}
			{/* Default Items */}
			<h2 className='text-xl sm:text-3xl font-semibold m-5'>
				Vật phẩm khuyên dùng
			</h2>
			{champion.defaultItems && champion.defaultItems.length > 0 && (
				<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 bg-gray-700 rounded-md p-4'>
					{champion.defaultItems.map((item, index) => (
						<img
							className='w-full max-w-[120px] h-auto'
							key={index}
							src={findItem(item.S)}
							alt={item.S}
						/>
					))}
				</div>
			)}
			{/* Default Powers */}
			<h2 className='text-xl sm:text-3xl font-semibold m-5'>Chòm sao</h2>
			{champion.defaultPowers && champion.defaultPowers.length > 0 && (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-700 rounded-md p-4'>
					{champion.defaultPowers.map((defaultPower, index) => (
						<img
							className='w-full max-w-[360px] h-auto'
							key={index}
							src={findPower(defaultPower.S)}
							alt={defaultPower.S}
						/>
					))}
				</div>
			)}
			<h2 className='text-xl sm:text-3xl font-semibold m-5'>Bộ cổ vật</h2>
			<div className='flex flex-wrap p-4 justify-center bg-gray-800 rounded-md mt-5'>
				{[1, 2, 3, 4, 5, 6].map(set => (
					<div
						className='bg-gray-700 rounded-2xl m-1 w-full sm:w-auto'
						key={set}
					>
						<h2 className='text-base sm:text-xl font-semibold ml-3'>
							Bộ cổ vật {set}
						</h2>
						{champion[`defaultRelicsSet${set}`] &&
							champion[`defaultRelicsSet${set}`].length > 0 && (
								<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4'>
									{champion[`defaultRelicsSet${set}`].map((relic, index) => (
										<img
											className='w-full max-w-[120px] h-auto'
											key={index}
											src={findRelic(relic.S)}
											alt={relic.S}
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

export default ChampionDetail;
