import SignOut from '@/components/common/auth/sign-out'
import { getUser } from '@/lib/get-user'

export default async function HomePage() {
	const user = await getUser()

	console.log('user: ', user)
	return (
		<div className='container'>
			<SignOut />
			<pre>{JSON.stringify(user, null, 4)}</pre>
		</div>
	)
}
