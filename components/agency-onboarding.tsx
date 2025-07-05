'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/libs/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/libs/ui/card'
import { BackgroundAnimation } from '@/libs/ui/background-animation'
import { Building2, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react'

const agencySchema = z.object({
  name: z.string().min(2, 'Agency name must be at least 2 characters'),
  description: z.string().optional(),
})

type AgencyFormData = z.infer<typeof agencySchema>

interface AgencyOnboardingProps {
  onComplete: () => void
}

export function AgencyOnboarding({ onComplete }: AgencyOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AgencyFormData>({
    resolver: zodResolver(agencySchema)
  })

  const onSubmit = async (data: AgencyFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/agency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create agency')
      }

      setStep(3) // Success step
      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const steps = [
    {
      title: 'Welcome to CreatorAI Manager',
      description: 'Let\'s set up your agency to get started',
      icon: Zap
    },
    {
      title: 'Create Your Agency',
      description: 'Tell us about your talent management business',
      icon: Building2
    },
    {
      title: 'All Set!',
      description: 'Your agency has been created successfully',
      icon: CheckCircle
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden flex items-center justify-center p-4">
      <BackgroundAnimation />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((stepItem, index) => {
            const StepIcon = stepItem.icon
            const stepNumber = index + 1
            const isActive = stepNumber === step
            const isCompleted = stepNumber < step

            return (
              <div key={index} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${isActive ? 'border-blue-600 bg-blue-600 text-white' : 
                    isCompleted ? 'border-green-500 bg-green-500 text-white' : 
                    'border-gray-300 bg-white text-gray-400'}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <StepIcon className="h-6 w-6" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mx-4 transition-all duration-300
                    ${stepNumber < step ? 'bg-green-500' : 'bg-gray-300'}
                  `} />
                )}
              </div>
            )
          })}
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {steps[step - 1].title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {steps[step - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Manage Multiple Creators</h3>
                      <p className="text-sm text-gray-600">Organize and track all your talent in one place</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4 p-4 bg-purple-50 rounded-lg">
                    <Zap className="h-8 w-8 text-purple-600" />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">AI-Powered Insights</h3>
                      <p className="text-sm text-gray-600">Get intelligent suggestions for content and partnerships</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4 p-4 bg-green-50 rounded-lg">
                    <Building2 className="h-8 w-8 text-green-600" />
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Scale Your Business</h3>
                      <p className="text-sm text-gray-600">Automate workflows and focus on growth</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setStep(2)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Agency Name *
                    </label>
                    <input
                      {...register('name')}
                      id="name"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Stellar Talent Agency"
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      {...register('description')}
                      id="description"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your agency and what makes it special..."
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isLoading ? 'Creating...' : 'Create Agency'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Congratulations!
                  </h3>
                  <p className="text-gray-600">
                    Your agency has been created successfully. You'll be redirected to your dashboard shortly.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 