// refactor to an object param later
export const getButtonStyles = (disabled = false, red = false) => {
	return (
		'font-semibold cursor-pointer py-2 px-4 rounded-md transition duration-200 ' +
		(disabled
			? 'bg-gray-400 text-gray-700 cursor-not-allowed '
			: red
				? 'bg-red-500 hover:bg-red-600 text-white'
				: 'bg-[#26561b] hover:bg-[#316f23] text-white ')
	);
};
