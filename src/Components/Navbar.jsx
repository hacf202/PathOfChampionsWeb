import { Link } from "react-router-dom";

function Navbar() {
	return (
		<div className='flex items-center justify-center bg-gray-600 p-4 z-[1] text-white font-bold text-[24px]'>
			<nav className='flex items-center gap-5'>
				<img
					className='h-[40px]'
					src='http://dd.b.pvp.net/6_3_0/set1/vi_vn/img/cards/01PZ056T10-full.png'
					alt='Logo'
				/>
				<div className='flex gap-5'>
					<Link
						to='/champions'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
					>
						Champions
					</Link>
					<Link
						to='/relics'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
					>
						Relics
					</Link>
					<Link
						to='/powers'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
					>
						Powers
					</Link>
					<Link
						to='/items'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
					>
						Items
					</Link>
					<Link
						to='/builds'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
					>
						Builds
					</Link>
					<Link
						to='/Random'
						className='hover:brightness-[0.8] hover:cursor-pointer transition-all'
					>
						Random
					</Link>
				</div>
			</nav>
		</div>
	);
}

export default Navbar;
