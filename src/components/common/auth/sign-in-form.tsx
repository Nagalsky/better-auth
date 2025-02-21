'use client'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthState } from '@/hooks/use-auth-state'
import { signIn } from '@/lib/auth-client'
import { LoginSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormError from '../form-error'

const SignInForm = () => {
	const router = useRouter()
	const { error, loading, setError, setLoading, resetState } = useAuthState()

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
		try {
			await signIn.email(
				{
					email: values.email,
					password: values.password,
				},
				{
					onResponse: () => {
						setLoading(false)
					},
					onRequest: () => {
						resetState()
						setLoading(true)
					},
					onSuccess: () => {
						router.replace('/')
					},
					onError: ctx => {
						if (ctx.error.status === 403) {
							setError('Please verify your email address')
						}
						setError(ctx.error.message)
					},
				}
			)
		} catch (error) {
			console.log(error)
			setError('Something went wrong')
		}
	}

	const googleSignIn = async () => {
		try {
			await signIn.social(
				{
					provider: 'google',
				},
				{
					onResponse: () => {
						setLoading(false)
					},
					onRequest: () => {
						setError('')
						setLoading(true)
					},
					onSuccess: () => {
						router.replace('/')
					},
					onError: ctx => {
						setError(ctx.error.message)
					},
				}
			)
		} catch (error: unknown) {
			console.error(error)
			setError('Something went wrong')
		}
	}

	return (
		<Card className='w-[400px] relative'>
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex gap-y-2 flex-col'>
					<FormError message={error} />
					<Form {...form}>
						<form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												disabled={loading}
												type='email'
												placeholder='example@gmail.com'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												disabled={loading}
												type='password'
												placeholder='********'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button disabled={loading} type='submit' className='w-full'>
								{loading ? 'Login in...' : 'Login'}
							</Button>
						</form>
					</Form>
					<Button variant={'outline'} onClick={googleSignIn} disabled={loading}>
						Sign in with Google
					</Button>
				</div>
			</CardContent>
			<CardFooter className='flex items-center justify-center gap-x-1'>
				<Link href='/forgot-password' className='underline'>
					Forgot Password?
				</Link>
			</CardFooter>
		</Card>
	)
}

export default SignInForm
