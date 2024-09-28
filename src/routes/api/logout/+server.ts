export const POST = async ({ cookies }) => {
	cookies.delete('validatedUsername', { path: '/' });
	cookies.delete('adminPass', { path: '/' });
	return json({ success: true });
};
