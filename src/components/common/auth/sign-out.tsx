'use client'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

const SignOut = () => {
	const router = useRouter()
	return (
		<Button
			onClick={async () => {
				await signOut({
					fetchOptions: {
						onSuccess: () => {
							router.push('/sign-in')
						},
					},
				})
			}}
		>
			Logout
		</Button>
	)
}

export default SignOut
