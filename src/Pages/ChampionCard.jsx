import { useState, useCallback } from "react";
import { memo } from "react";
import "../Css/cssReset.css";

function ChampionCard({ champion }) {
	// Initialize favorite state from localStorage
	const [isFavorited, setIsFavorited] = useState(() => {
		const favorites = JSON.parse(
			localStorage.getItem("championFavorites") || "{}"
		);
		return !!favorites[champion.name];
	});

	// Toggle favorite state and update localStorage
	const toggleFavorite = useCallback(() => {
		setIsFavorited(prev => {
			const newState = !prev;
			const favorites = JSON.parse(
				localStorage.getItem("championFavorites") || "{}"
			);
			favorites[champion.name] = newState ? true : undefined;
			localStorage.setItem("championFavorites", JSON.stringify(favorites));
			return newState;
		});
	}, [champion.name]);

	return (
		<div
			className='bg-transparent w-[150px] h-[220px] relative overflow-hidden cursor-pointer hover:brightness-90 transition-all'
			onClick={toggleFavorite}
			role='button'
			aria-label={`Toggle favorite for ${champion.name || "Unknown Champion"}`}
			tabIndex={0}
			onKeyDown={e => (e.key === "Enter" || e.key === " ") && toggleFavorite()}
		>
			<img
				className='absolute object-cover w-full h-full'
				src={
					champion.assets[0]?.M.gameAbsolutePath.S || "/images/placeholder.png"
				}
				alt={champion.name || "Unknown Champion"}
				loading='lazy'
			/>
			{isFavorited && (
				<span
					className='absolute top-2 right-2 text-yellow-400 text-xl'
					aria-hidden='true'
				>
					★
				</span>
			)}
		</div>
	);
}

export default memo(ChampionCard);
