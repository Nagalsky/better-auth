import { User } from 'better-auth'
import { headers } from 'next/headers'
import { auth } from './auth'

export async function getUser() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	const user = session?.user as User

	return user
}
