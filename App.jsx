import "./src/Css/cssReset.css";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import Navbar from "./src/Components/Navbar";
import Champions from "./src/Pages/Champions";
import Relics from "./src/Pages/Relics";
import Powers from "./src/Pages/Powers";
import Items from "./src/Pages/Items";
import Builds from "./src/Pages/Builds.jsx";
import ChampionDetail from "./src/Pages/ChampionDetail";
import Random from "./src/Pages/Random.jsx";
import Footer from "./src/Components/Footer.jsx";
import { useEffect } from "react";

function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		// Cuộn lên đầu trang khi pathname thay đổi
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [pathname]);

	return null;
}

function App() {
	return (
		<Router>
			<div className='relative w-full min-h-screen bg-gray-900 flex flex-col'>
				<ScrollToTop /> {/* Thêm component này */}
				<Navbar />
				<main className='flex-1 max-w-[1200px] mx-auto w-full p-4 sm:p-6'>
					<Routes>
						<Route path='/' element={<Champions />} />
						<Route path='/champions' element={<Champions />} />
						<Route path='/relics' element={<Relics />} />
						<Route path='/powers' element={<Powers />} />
						<Route path='/items' element={<Items />} />
						<Route path='/champion/:name' element={<ChampionDetail />} />
						<Route path='/builds' element={<Builds />} />
						<Route path='/random' element={<Random />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
