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
import { signIn, signUp } from '@/lib/auth-client'
import { SignupSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormError from '../form-error'
import FormSuccess from '../form-success'

const SignUpForm = () => {
	const router = useRouter()
	const {
		error,
		success,
		loading,
		setSuccess,
		setError,
		setLoading,
		resetState,
	} = useAuthState()

	const form = useForm<z.infer<typeof SignupSchema>>({
		resolver: zodResolver(SignupSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
		try {
			await signUp.email(
				{
					name: values.name,
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
						setSuccess('Verification link has been sent to your mail')
					},
					onError: ctx => {
						setError(ctx.error.message)
					},
				}
			)
		} catch (error) {
			console.error(error)
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
				<CardTitle>SignUp</CardTitle>
				<CardDescription>Create an new account</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex gap-y-2 flex-col'>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Form {...form}>
						<form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												disabled={loading}
												type='text'
												placeholder='john'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
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
								{loading ? 'Signing up...' : 'Sign up'}
							</Button>
						</form>
					</Form>
					<Button variant={'outline'} onClick={googleSignIn} disabled={loading}>
						Sign up with Google
					</Button>
				</div>
			</CardContent>
			<CardFooter className='flex items-center justify-center gap-x-1'>
				<span>Dont have an account?</span>
				<Link
					href={'/signup'}
					className='underline text-blue-500 hover:text-blue-700'
				>
					Sign up
				</Link>
			</CardFooter>
		</Card>
	)
}

export default SignUpForm
