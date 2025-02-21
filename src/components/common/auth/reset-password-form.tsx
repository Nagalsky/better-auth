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
import { ResetPasswordSchema } from '@/schemas/auth-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormError from '../form-error'
import FormSuccess from '../form-success'

const ResetPasswordForm = () => {
	const router = useRouter()

	const searchParams = useSearchParams()
	const token = searchParams.get('token') || ''

	const {
		error,
		success,
		loading,
		setError,
		setSuccess,
		setLoading,
		resetState,
	} = useAuthState()

	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
		try {
			// Call the authClient's reset password method, passing the email and a redirect URL.
			await authClient.resetPassword(
				{
					newPassword: values.password, // new password given by user
					token,
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
						setSuccess('New password has been created')
						router.replace('/signin')
					},
					onError: ctx => {
						setError(ctx.error.message)
					},
				}
			)
		} catch (error) {
			// catches the error
			console.log(error)
			setError('Something went wrong')
		}
	}

	return (
		<Card className='w-[400px] relative'>
			<CardHeader>
				<CardTitle>Reset Password</CardTitle>
				<CardDescription>Create a new password</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex gap-y-2 flex-col'>
					<FormError message={error} />
					<FormSuccess message={success} />
					<Form {...form}>
						<form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
												placeholder='************'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												disabled={loading}
												type='password'
												placeholder='*************'
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

export default ResetPasswordForm
