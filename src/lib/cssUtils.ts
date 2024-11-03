export const getButtonStyles = (disabled: boolean) => {
	return (
		'font-semibold py-2 px-4 rounded-md transition duration-200 ' +
		(disabled
			? 'bg-gray-400 text-gray-700 cursor-not-allowed'
			: 'bg-[#26561b] hover:bg-[#316f23] text-white')
	);
};
