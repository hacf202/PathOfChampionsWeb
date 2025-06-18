import "./src/Css/cssReset.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./src/Components/Navbar";
import Champions from "./src/Pages/Champions";
import Relics from "./src/Pages/Relics";
import Powers from "./src/Pages/Powers";
import Items from "./src/Pages/Items";
import Builds from "./src/Pages/Builds.jsx";
import ChampionDetail from "./src/Pages/ChampionDetail";
import Random from "./src/Pages/Random.jsx";
import Footer from "./src/Components/Footer.jsx";

function App() {
	return (
		<Router>
			<div className='relative w-full min-h-screen bg-gray-900'>
				<Navbar />
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
			</div>
			<Footer />
		</Router>
	);
}

export default App;
