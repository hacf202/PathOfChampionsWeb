import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className='w-screen mx-auto'>
			<nav className='flex flex-col sm:flex-row items-center justify-center gap-4 bg-gray-600 p-4 sm:p-6 z-[1] text-white font-bold'>
				<div className='flex items-center justify-between w-full sm:w-auto'>
					<img
						className='h-8 sm:h-10'
						src='https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/10002.jpg'
						alt='Logo'
					/>
					<button
						className='sm:hidden text-white focus:outline-none'
						onClick={toggleMenu}
						aria-label='Toggle menu'
					>
						<svg
							className='w-6 h-6'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d={
									isMenuOpen
										? "M6 18L18 6M6 6l12 12"
										: "M4 6h16M4 12h16M4 18h16"
								}
							></path>
						</svg>
					</button>
				</div>
				<div
					className={`${
						isMenuOpen ? "flex" : "hidden"
					} sm:flex flex-col sm:flex-row gap-3 sm:gap-5 text-base sm:text-xl w-full sm:w-auto`}
				>
					<Link
						to='/champions'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
						onClick={() => setIsMenuOpen(false)}
					>
						Champions
					</Link>
					<Link
						to='/relics'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
						onClick={() => setIsMenuOpen(false)}
					>
						Relics
					</Link>
					<Link
						to='/powers'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
						onClick={() => setIsMenuOpen(false)}
					>
						Powers
					</Link>
					<Link
						to='/items'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
						onClick={() => setIsMenuOpen(false)}
					>
						Items
					</Link>
					<Link
						to='/builds'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
						onClick={() => setIsMenuOpen(false)}
					>
						Builds
					</Link>
					<Link
						to='/random'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
						onClick={() => setIsMenuOpen(false)}
					>
						Random
					</Link>
				</div>
			</nav>
			<h2 className='text-white w-full text-center text-xs sm:text-sm py-2'>
				Ủng hộ tiền mua mì gói tại: MB 9704 2220 3349 9716
			</h2>
		</div>
	);
}

export default Navbar;
