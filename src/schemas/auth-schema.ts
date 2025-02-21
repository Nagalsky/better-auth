import { z } from 'zod'
export const SignupSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Minimum 2 characters are required' })
		.max(20, { message: 'Maximum of 20 characters are allowed' }),
	email: z
		.string()
		.email({ message: 'Invalid email address' })
		.min(1, { message: 'Email is required' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 6 characters long' })
		.max(20, { message: 'Password must be at most 20 characters long' }),
})

export const LoginSchema = z.object({
	email: z
		.string()
		.email({ message: 'Invalid email' })
		.min(1, { message: 'Email is required' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters long' })
		.max(20, { message: 'Password must be at most 20 characters long' }),
})

export const ForgotPasswordSchema = z.object({
	email: z
		.string()
		.email({ message: 'Invalid type' })
		.min(1, { message: 'Email is required' }),
})

export const ResetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters long' })
			.max(20, { message: 'Password must be at most 20 characters long' }),
		confirmPassword: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters long' })
			.max(20, { message: 'Password must be at most 20 characters long' }),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})
