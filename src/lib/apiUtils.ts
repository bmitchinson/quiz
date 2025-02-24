export const makePostRequest = async (
	url: string,
	body: object,
	successCallback: (data: any) => void,
	errorCallback: (err: any) => void
) => {
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	})
		.then((res) => res.json())
		.then(successCallback)
		.catch((err) => {
			console.error(err);
			errorCallback(err);
		});
};
