import { json } from '@sveltejs/kit';

export async function GET() {
	const lokiUrl = process.env.LOKI_URL! + '/loki/api/v1/push';
	const basicAuth = process.env.LOKI_BASICAUTH!;

	const authHeader = 'Basic ' + Buffer.from(basicAuth).toString('base64');

	const ts = Date.now() * 1e6; // ns timestamp
	const payload = {
		streams: [
			{
				stream: { app: 'vercel-app', level: 'info' },
				values: [[ts.toString(), 'hello from vercel/sveltekit']]
			}
		]
	};

	return json({});

	// const res = await fetch(lokiUrl, {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 		Authorization: authHeader
	// 	},
	// 	body: JSON.stringify(payload)
	// });

	// return json({
	// 	lokiStatus: res.status,
	// 	lokiStatusText: res.statusText
	// });
}
