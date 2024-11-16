import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Package } from 'lucide-react'

export default function Auth() {
	const [loading, setLoading] = useState(false)
	const [email, setEmail] = useState('')

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		try {
			const { error } = await supabase.auth.signInWithOtp({
				email,
				options: {
					shouldCreateUser: false,
					emailRedirectTo:
						window.location.origin || 'https://container-mgmt.dowshawaii.win',
				},
			})

			if (error) throw error
			alert('Check your email for the login link!')
		} catch (error) {
			alert(error instanceof Error ? error.message : 'An error occurred')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
			<div className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md'>
				<div className='text-center'>
					<Package className='mx-auto h-12 w-12 text-purple-600' />
					<h2 className='mt-6 text-3xl font-bold text-gray-900'>
						Warehouse Inventory
					</h2>
					<p className='mt-2 text-sm text-gray-600'>
						Sign in to manage your inventory
					</p>
				</div>

				<form className='mt-8 space-y-6' onSubmit={handleLogin}>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'>
							Email address
						</label>
						<input
							id='email'
							type='email'
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500'
							placeholder='you@example.com'
						/>
					</div>

					<button
						type='submit'
						disabled={loading}
						className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed'>
						{loading ? 'Sending magic link...' : 'Sign in with Email'}
					</button>
				</form>
			</div>
		</div>
	)
}
