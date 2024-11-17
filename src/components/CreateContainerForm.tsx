import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface CreateContainerFormProps {
  onCreateList: (containerNumber: string) => Promise<void>
}

export default function CreateContainerForm({
  onCreateList,
}: CreateContainerFormProps) {
  const [containerNumber, setContainerNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onCreateList(containerNumber.toUpperCase())
      setContainerNumber('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-md mx-auto bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>
        Create New Container List
      </h2>

      <div className='mb-4'>
        <label
          htmlFor='containerNumber'
          className='block text-sm font-medium text-gray-700 mb-1'>
          Container Number
        </label>
        <input
          id='containerNumber'
          type='text'
          placeholder='ABCD-12345'
          pattern='^[A-Za-z]{4}-[0-9]{5}$'
          required
          value={containerNumber}
          onChange={(e) => setContainerNumber(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500'
        />
        <p className='mt-1 text-sm text-gray-500'>
          Format: LLLL-XXXXX (4 letters, hyphen, 5 numbers)
        </p>
      </div>

      <button
        type='submit'
        disabled={loading}
        className='w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'>
        {loading ? (
          <>
            <Loader2 className='w-4 h-4 animate-spin' />
            Creating...
          </>
        ) : (
          'Create Container List'
        )}
      </button>
    </form>
  )
}
