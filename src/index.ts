export interface Env {
	PROJECT_ID: number;
	SECRET_API_ACCESS_KEY: string;
	DAYS: number;
}

const endDate = () => {
	const today = new Date();
	return today.toISOString().substring(0, 10);
}

const startDate = (env: Env) => {
	const today = new Date();

	// Format today's date as a string
	const daysBefore = new Date(today);
	daysBefore.setDate(daysBefore.getDate() - env.DAYS);
	
	// Format the date 7 days before as a string
	const daysBeforeString = daysBefore.toISOString().substring(0, 10);
	return daysBeforeString
}

const handleDailyWallets = async (env: Env, request: Request) => {
	const resp = await fetch(
	`https://api.sequence.build/rpc/Builder/WalletsDaily`,
		{
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${env.SECRET_API_ACCESS_KEY}`
			},
			body: JSON.stringify({
			filter: {
				dateInterval: 'DAY',
				endDate: endDate(),
				projectId: env.PROJECT_ID,
				startDate: startDate(env)
			}
			})
		}
	)
	
	const data: any = await resp.json();
	return new Response(JSON.stringify(data.walletStats), { status: 200 });
}

const handleTotalTxns = async (env: Env, request: Request) => {
	const resp = await fetch(
	`https://api.sequence.build/rpc/Builder/WalletsTxnSentTotal`,
		{
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${env.SECRET_API_ACCESS_KEY}`
		  },
		  body: JSON.stringify({
			filter: {
			  dateInterval: 'DAY',
			  endDate: endDate(),
			  projectId: env.PROJECT_ID,
			  startDate: startDate(env)
			}
		  })
		}
	)
	
	const data: any = await resp.json();
	return new Response(JSON.stringify(data.walletStats), { status: 200 });
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		
		const url = new URL(request.url);
		
		// Handle different endpoints
		if (url.pathname === "/dailyActiveUsers") {
			return handleDailyWallets(env, request);
		} else if (url.pathname === "/totalTransactionsSent") {
			return handleTotalTxns(env,request);
		} else {
			return new Response("No function for this URL", { status: 405 });
		}
	},
}