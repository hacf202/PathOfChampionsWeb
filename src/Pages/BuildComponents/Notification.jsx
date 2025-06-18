function Notification({ saveStatus }) {
	if (!saveStatus) return null;

	return (
		<div
			className={`fixed top-4 right-4 p-3 rounded-md text-white ${
				saveStatus.type === "success" ? "bg-green-600" : "bg-red-600"
			} shadow-md animate-fade-in`}
		>
			{saveStatus.message}
		</div>
	);
}

export default Notification;
