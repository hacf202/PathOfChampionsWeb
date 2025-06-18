import BuildCard from "./BuildCard";

function BuildList({
	builds,
	championsList,
	relicsList,
	itemsList,
	powersList,
	onAddBuild,
	onEditBuild,
	onDeleteBuild,
}) {
	return (
		<>
			<div className='mb-6 flex justify-center'>
				<button
					onClick={onAddBuild}
					className='px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 sm:w-[80%] '
				>
					Thêm Build
				</button>
			</div>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-700 rounded-lg p-4 min-h-[calc(100vh-200px)]'>
				{builds.length === 0 ? (
					<p className='text-center col-span-full text-gray-300'>
						Chưa có build nào.
					</p>
				) : (
					builds.map(build => (
						<BuildCard
							key={build.id}
							build={build}
							championsList={championsList}
							relicsList={relicsList}
							itemsList={itemsList}
							powersList={powersList}
							onEdit={() => onEditBuild(build)}
							onDelete={() => onDeleteBuild(build.id)}
						/>
					))
				)}
			</div>
		</>
	);
}

export default BuildList;
