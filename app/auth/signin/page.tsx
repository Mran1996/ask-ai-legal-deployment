'use client'

import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function SignInPage() {
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      await signIn('credentials', {
        redirect: false,
      })
      router.push('/dashboard')
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-screen-sm w-full space-y-6 md:space-y-8 p-4 md:p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-4 md:mt-6 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-6 md:mt-8 space-y-4 md:space-y-6">
          <Button
            onClick={handleSignIn}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm md:text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Sign in
          </Button>
        </div>
      </div>
    </div>
  )
} 