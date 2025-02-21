import { betterAuth, BetterAuthOptions } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import prisma from './prisma'
import { resend } from './resend'

export const auth = betterAuth({
	appName: 'better_auth_nextjs',
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			redirectURI: process.env.BETTER_AUTH_URL + '/api/auth/callback/google',
		},
	},
	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		minPasswordLength: 8,
		maxPasswordLength: 20,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			await resend.emails.send({
				from: process.env.RESEND_EMAIL_FROM!,
				to: user.email,
				subject: 'Reset your password',
				html: `Click the link to reset your password: ${url}`,
			})
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			await resend.emails.send({
				from: process.env.RESEND_EMAIL_FROM!,
				to: user.email,
				subject: 'Email Verification',
				html: `Click the link to verify your email: ${url}`, // Content of the email
				// you could also use "React:" option for sending the email template and there content to user
			})
		},
	},
} satisfies BetterAuthOptions)

export type Session = typeof auth.$Infer.Session
