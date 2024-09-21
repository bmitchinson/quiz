export function passwordIsValid(password: string): boolean {
	return password === process.env.ADMIN_PASSWORD;
}
