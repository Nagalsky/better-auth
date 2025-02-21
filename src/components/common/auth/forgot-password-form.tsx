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
import { authClient } from '@/lib/auth-client'
import { ForgotPasswordSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormError from '../form-error'
import FormSuccess from '../form-success'

const ForgotPasswordForm = () => {
	const {
		error,
		success,
		loading,
		setError,
		setSuccess,
		setLoading,
		resetState,
	} = useAuthState()

	const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
		try {
			// Call the authClient's forgetPassword method, passing the email and a redirect URL.
			await authClient.forgetPassword(
				{
					email: values.email, // Email to which the reset password link should be sent.
					redirectTo: '/reset-password', // URL to redirect the user after resetting the password.
				},
				{
					// Lifecycle hooks to handle different stages of the request.
					onResponse: () => {
						setLoading(false)
					},
					onRequest: () => {
						resetState()
						setLoading(true)
					},
					onSuccess: () => {
						setSuccess('Reset password link has been sent')
					},
					onError: ctx => {
						setError(ctx.error.message)
					},
				}
			)
		} catch (error) {
			// catch the error
			console.log(error)
			setError('Something went wrong')
		}
	}

	return (
		<Card className='w-[400px] relative'>
			<CardHeader>
				<CardTitle>Forgot Password</CardTitle>
				<CardDescription>
					Enter your email to send link to reset password
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex gap-y-2 flex-col'>
					<FormError message={error} />
					<FormSuccess message={success} />
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

							<Button disabled={loading} type='submit' className='w-full'>
								Submit
							</Button>
						</form>
					</Form>
				</div>
			</CardContent>
			<CardFooter className='flex items-center justify-center gap-x-1'>
				<span>Remember your password?</span>
				<Link
					href={'/signin'}
					className='underline text-blue-500 hover:text-blue-700'
				>
					Sign in
				</Link>
			</CardFooter>
		</Card>
	)
}

export default ForgotPasswordForm
