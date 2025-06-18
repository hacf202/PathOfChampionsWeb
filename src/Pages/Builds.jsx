import { useState, useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import chamPOC from "../Data/chamPOC.json";
import relics from "../Data/relics-vi_vn.json";
import items from "../Data/items-vi_vn.json";
import powers from "../Data/powers-vi_vn.json";
import iconRegions from "../Data/iconRegions.json";
import BuildList from "./BuildComponents/BuildList.jsx";
import AddBuildModal from "./BuildComponents/AddBuildModal.jsx";
import EditBuildModal from "./BuildComponents/EditBuildModal.jsx";
import Notification from "./BuildComponents/Notification.jsx";
import CustomDropdown from "./BuildComponents/CustomDropdown";

// Preload hình ảnh khu vực
const preloadImages = imageUrls => {
	imageUrls.forEach(url => {
		const link = document.createElement("link");
		link.rel = "preload";
		link.as = "image";
		link.href = url;
		document.head.appendChild(link);
	});
};

// Chuẩn hóa dữ liệu với useMemo
const useDataLists = () => {
	const championsList = useMemo(
		() =>
			chamPOC.map(champ => ({
				name: champ.name,
				image:
					champ.assets[0]?.M.gameAbsolutePath.S || "/images/placeholder.png",
				region: champ.regionRefs?.join(", ") || "Không xác định",
			})),
		[]
	);
	const relicsList = useMemo(
		() =>
			relics.map(relic => ({
				name: relic.name,
				image: relic.assetAbsolutePath || "/images/placeholder.png",
				description: relic.descriptionRaw || "Không có mô tả",
			})),
		[]
	);
	const itemsList = useMemo(
		() =>
			items.map(item => ({
				name: item.name,
				image: item.assetAbsolutePath || "/images/placeholder.png",
				description: item.descriptionRaw || "Không có mô tả",
			})),
		[]
	);
	const powersList = useMemo(
		() =>
			powers.map(power => ({
				name: power.name,
				image: power.assetAbsolutePath || "/images/placeholder.png",
				description: power.descriptionRaw || "Không có mô tả",
			})),
		[]
	);
	const regionsList = useMemo(() => {
		const regions = iconRegions.map(region => ({
			name: region.nameRef,
			image: region.iconAbsolutePath || "/images/placeholder.png",
		}));
		// Preload hình ảnh khu vực
		const validImages = regions
			.map(r => r.image)
			.filter(img => img && img !== "/images/placeholder.png");
		preloadImages(validImages);
		// Ghi log để kiểm tra dữ liệu
		if (import.meta.env.DEV) {
			console.log("Regions List:", regions);
			regions.forEach(region => {
				if (!region.image || region.image === "/images/placeholder.png") {
					console.warn(
						`Hình ảnh không hợp lệ cho khu vực ${region.name}: ${region.image}`
					);
				}
			});
		}
		return regions;
	}, []);

	return { championsList, relicsList, itemsList, powersList, regionsList };
};

function Builds() {
	const { championsList, relicsList, itemsList, powersList, regionsList } =
		useDataLists();
	const [builds, setBuilds] = useState([]);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [currentBuild, setCurrentBuild] = useState(null);
	const [formData, setFormData] = useState({
		championName: "",
		artifacts: ["", "", ""],
		items: ["", "", "", "", "", ""],
		powers: ["", "", "", "", "", ""],
		description: "",
		creator: "",
	});
	const [errors, setErrors] = useState({ championName: "", artifacts: "" });
	const [saveStatus, setSaveStatus] = useState(null);
	const [filterChampion, setFilterChampion] = useState("");
	const [filterArtifact, setFilterArtifact] = useState("");
	const [selectedRegion, setSelectedRegion] = useState("");
	const [openDropdownId, setOpenDropdownId] = useState(null);

	const handleToggleDropdown = dropdownId => {
		setOpenDropdownId(openDropdownId === dropdownId ? null : dropdownId);
	};

	const handleDropdownSelect = (name, value) => {
		if (name === "filterChampion") setFilterChampion(value);
		if (name === "filterArtifact") setFilterArtifact(value);
		if (name === "selectedRegion") setSelectedRegion(value);
	};

	useEffect(() => {
		if (saveStatus) {
			const timer = setTimeout(() => setSaveStatus(null), 5000);
			return () => clearTimeout(timer);
		}
	}, [saveStatus]);

	useEffect(() => {
		fetch("https://pocweb.onrender.com/api/load-builds")
			.then(response => {
				if (!response.ok) throw new Error("Lỗi khi tải builds từ server");
				return response.json();
			})
			.then(data => setBuilds(data || []))
			.catch(error => {
				console.error("Lỗi khi tải builds:", error);
				setSaveStatus({
					type: "error",
					message: error.message || "Không thể tải builds.",
				});
			});
	}, []);

	const saveBuildsToFile = async (updatedBuilds, action) => {
		try {
			const response = await fetch(
				"https://pocweb.onrender.com/api/save-builds",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(updatedBuilds),
				}
			);
			if (!response.ok) {
				const { error } = await response.json();
				throw new Error(error || "Lỗi khi lưu builds");
			}
			let message;
			switch (action) {
				case "add":
					message = "Đã thêm build thành công!";
					break;
				case "edit":
					message = "Đã cập nhật build thành công!";
					break;
				case "delete":
					message = "Đã xóa build thành công!";
					break;
				default:
					message = "Đã lưu builds thành công!";
			}
			setSaveStatus({ type: "success", message });
		} catch (error) {
			console.error("Lỗi khi lưu builds:", error);
			setSaveStatus({
				type: "error",
				message: error.message || "Không thể lưu builds.",
			});
		}
	};

	const validateForm = () => {
		let isValid = true;
		const newErrors = { championName: "", artifacts: "" };

		if (!formData.championName) {
			newErrors.championName = "Vui lòng chọn tướng.";
			isValid = false;
		}
		if (!formData.artifacts.some(artifact => artifact)) {
			newErrors.artifacts = "Vui lòng chọn ít nhất một cổ vật.";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleAddBuild = async () => {
		if (!validateForm()) return;
		const newBuild = { id: String(uuidv4()), ...formData };
		const newBuilds = [...builds, newBuild];
		setBuilds(newBuilds);
		await saveBuildsToFile(newBuilds, "add");
		setFormData({
			championName: "",
			artifacts: ["", "", ""],
			items: ["", "", "", "", "", ""],
			powers: ["", "", "", "", "", ""],
			description: "",
			creator: "",
		});
		setIsAddModalOpen(false);
	};

	const handleEditBuild = build => {
		setCurrentBuild(build);
		setFormData({
			championName: build.championName,
			artifacts: build.artifacts,
			items: build.items || ["", "", "", "", "", ""],
			powers: build.powers || ["", "", "", "", "", ""],
			description: build.description,
			creator: build.creator,
		});
		setIsEditModalOpen(true);
	};

	const handleSaveEdit = async () => {
		if (!validateForm()) return;
		const newBuilds = builds.map(build =>
			build.id === currentBuild.id ? { id: build.id, ...formData } : build
		);
		setBuilds(newBuilds);
		await saveBuildsToFile(newBuilds, "edit");
		setIsEditModalOpen(false);
		setFormData({
			championName: "",
			artifacts: ["", "", ""],
			items: ["", "", "", "", "", ""],
			powers: ["", "", "", "", "", ""],
			description: "",
			creator: "",
		});
		setCurrentBuild(null);
	};

	const handleDeleteBuild = async id => {
		if (window.confirm("Bạn có chắc muốn xóa build này?")) {
			const newBuilds = builds.filter(build => build.id !== id);
			setBuilds(newBuilds);
			await saveBuildsToFile(newBuilds, "delete");
		}
	};

	const uniqueRegions = useMemo(() => {
		const regions = [
			...new Set(
				chamPOC.flatMap(champ => champ.regionRefs || []).filter(Boolean)
			),
		];
		return regions.sort();
	}, []);

	const filteredBuilds = useMemo(() => {
		return builds.filter(build => {
			const champion = championsList.find(
				champ => champ.name === build.championName
			);
			const matchesChampion =
				!filterChampion || build.championName === filterChampion;
			const matchesArtifact =
				!filterArtifact || build.artifacts.includes(filterArtifact);
			const matchesRegion =
				!selectedRegion ||
				(champion && champion.region.split(", ").includes(selectedRegion));
			return matchesChampion && matchesArtifact && matchesRegion;
		});
	}, [builds, filterChampion, filterArtifact, selectedRegion, championsList]);

	const resetFilters = () => {
		setFilterChampion("");
		setFilterArtifact("");
		setSelectedRegion("");
	};

	return (
		<div className='relative w-full min-h-screen bg-gray-900 text-white'>
			<div className='mt-8 p-4 mx-auto max-w-6xl'>
				<Notification saveStatus={saveStatus} />
				<div className='mb-6 flex flex-col sm:flex-row gap-4 items-center justify-center'>
					<div className=' flex flex-col sm:flex-row gap-4 items-center w-[80%]'>
						<CustomDropdown
							name='filterChampion'
							value={filterChampion}
							options={[...championsList]}
							onSelect={handleDropdownSelect}
							dropdownId='filter-champion'
							placeholder='Tất cả tướng'
							ariaLabel='Chọn tướng để lọc'
							isOpen={openDropdownId === "filter-champion"}
							onToggle={handleToggleDropdown}
							className='w-full sm:w-60'
						/>
						<CustomDropdown
							name='filterArtifact'
							value={filterArtifact}
							options={[...relicsList]}
							onSelect={handleDropdownSelect}
							dropdownId='filter-artifact'
							placeholder='Tất cả cổ vật'
							ariaLabel='Chọn cổ vật để lọc'
							isOpen={openDropdownId === "filter-artifact"}
							onToggle={handleToggleDropdown}
							className='w-full sm:w-60'
						/>
						<CustomDropdown
							name='selectedRegion'
							value={selectedRegion}
							options={[
								...uniqueRegions.map(region => {
									const regionData = regionsList.find(r => r.name === region);
									return {
										name: region,
										value: region,
										image: regionData?.image,
									};
								}),
							]}
							onSelect={handleDropdownSelect}
							dropdownId='filter-region'
							placeholder='Tất cả khu vực'
							ariaLabel='Chọn khu vực để lọc'
							isOpen={openDropdownId === "filter-region"}
							onToggle={handleToggleDropdown}
							className='w-full sm:w-60'
						/>
					</div>
					<button
						onClick={resetFilters}
						className=' bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700 transition-colors duration-200 font-medium w-[80%] sm:w-auto'
					>
						Reset Bộ lọc
					</button>
				</div>
				<BuildList
					builds={filteredBuilds}
					championsList={championsList}
					relicsList={relicsList}
					itemsList={itemsList}
					powersList={powersList}
					onAddBuild={() => setIsAddModalOpen(true)}
					onEditBuild={handleEditBuild}
					onDeleteBuild={handleDeleteBuild}
				/>
				<AddBuildModal
					isOpen={isAddModalOpen}
					onClose={() => setIsAddModalOpen(false)}
					formData={formData}
					setFormData={setFormData}
					errors={errors}
					championsList={championsList}
					relicsList={relicsList}
					itemsList={itemsList}
					powersList={powersList}
					onSave={handleAddBuild}
				/>
				<EditBuildModal
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					formData={formData}
					setFormData={setFormData}
					errors={errors}
					championsList={championsList}
					relicsList={relicsList}
					itemsList={itemsList}
					powersList={powersList}
					onSave={handleSaveEdit}
				/>
			</div>
			<style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
        .transition-all {
          transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .region-section img {
          display: block;
          width: 100%;
          height: 100%;
        }
        .region-section .animate-pulse:not([src="/images/placeholder.png"]) {
          display: block;
        }
      `}</style>
		</div>
	);
}

export default Builds;
