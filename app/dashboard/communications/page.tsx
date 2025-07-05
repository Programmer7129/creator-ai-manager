'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/libs/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/libs/ui/card'
import { Header } from '@/components/header'
import {
  MessageSquare,
  Mail,
  Brain,
  Copy,
  Send,
  Sparkles,
  User,
  Building,
  FileText,
  Heart,
  Users,
  RefreshCw
} from 'lucide-react'

const emailFormSchema = z.object({
  type: z.enum(['outreach', 'negotiation', 'followup', 'collaboration', 'thank_you']),
  creatorName: z.string().min(1, 'Creator name is required'),
  brandName: z.string().min(1, 'Brand name is required'),
  campaignDetails: z.string().optional(),
  previousContext: z.string().optional(),
  tone: z.enum(['professional', 'friendly', 'casual', 'formal']).default('professional'),
  keyPoints: z.string().optional(),
})

type EmailFormData = z.infer<typeof emailFormSchema>

interface Creator {
  id: string
  name: string
  niche: string
}

const emailTypes = [
  {
    id: 'outreach',
    title: 'Brand Outreach',
    description: 'Introduce creators to potential brand partners',
    icon: Mail,
    color: 'bg-blue-500'
  },
  {
    id: 'negotiation',
    title: 'Contract Negotiation',
    description: 'Discuss terms, rates, and deliverables',
    icon: Users,
    color: 'bg-green-500'
  },
  {
    id: 'followup',
    title: 'Follow-up',
    description: 'Check on pending collaborations',
    icon: RefreshCw,
    color: 'bg-orange-500'
  },
  {
    id: 'collaboration',
    title: 'Collaboration Proposal',
    description: 'Propose specific campaign ideas',
    icon: Sparkles,
    color: 'bg-purple-500'
  },
  {
    id: 'thank_you',
    title: 'Thank You',
    description: 'Express gratitude after successful campaigns',
    icon: Heart,
    color: 'bg-pink-500'
  }
]

export default function CommunicationsPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState('')
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      tone: 'professional'
    }
  })

  const selectedCreator = watch('creatorName')

  const fetchCreators = async () => {
    try {
      const response = await fetch('/api/creators')
      if (response.ok) {
        const data = await response.json()
        setCreators(data)
      }
    } catch (error) {
      console.error('Error fetching creators:', error)
    }
  }

  useEffect(() => {
    fetchCreators()
  }, [])

  const onSubmit = async (data: EmailFormData) => {
    setIsGenerating(true)
    setError('')
    
    try {
      const creator = creators.find(c => c.id === data.creatorName)
      if (!creator) {
        throw new Error('Creator not found')
      }

      const keyPoints = data.keyPoints 
        ? data.keyPoints.split(',').map(point => point.trim()).filter(Boolean)
        : []

      const requestBody = {
        type: data.type,
        context: {
          creatorName: creator.name,
          creatorNiche: creator.niche,
          brandName: data.brandName,
          campaignDetails: data.campaignDetails,
          previousContext: data.previousContext,
          tone: data.tone,
          keyPoints,
        }
      }

      const response = await fetch('/api/ai/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate email')
      }

      const result = await response.json()
      setGeneratedEmail(result.email)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const fadeInUp = {
    initial: { 
      opacity: 0, 
      y: 20 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="Email Assistant" 
        subtitle="AI-powered email drafting for sponsorship communications"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Type Selection */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Select Email Type</span>
              </CardTitle>
              <CardDescription>Choose the type of email you want to draft</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {emailTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id)
                        reset({ ...watch(), type: type.id as any })
                      }}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${type.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{type.title}</h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Email Form */}
          {selectedType && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Email Details</span>
                </CardTitle>
                <CardDescription>Provide context for your email</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="creatorName" className="block text-sm font-medium text-gray-700 mb-1">
                        Creator *
                      </label>
                      <select
                        {...register('creatorName')}
                        id="creatorName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Creator</option>
                        {creators.map(creator => (
                          <option key={creator.id} value={creator.id}>
                            {creator.name} - {creator.niche}
                          </option>
                        ))}
                      </select>
                      {errors.creatorName && (
                        <p className="text-red-600 text-sm mt-1">{errors.creatorName.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
                        Brand Name *
                      </label>
                      <input
                        {...register('brandName')}
                        id="brandName"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Nike"
                      />
                      {errors.brandName && (
                        <p className="text-red-600 text-sm mt-1">{errors.brandName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Tone
                    </label>
                    <select
                      {...register('tone')}
                      id="tone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="casual">Casual</option>
                      <option value="formal">Formal</option>
                    </select>
                  </div>

                  {selectedType === 'collaboration' && (
                    <div>
                      <label htmlFor="campaignDetails" className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign Details
                      </label>
                      <textarea
                        {...register('campaignDetails')}
                        id="campaignDetails"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the campaign or collaboration idea..."
                      />
                    </div>
                  )}

                  {selectedType === 'followup' && (
                    <div>
                      <label htmlFor="previousContext" className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Context
                      </label>
                      <textarea
                        {...register('previousContext')}
                        id="previousContext"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Brief summary of previous communication..."
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="keyPoints" className="block text-sm font-medium text-gray-700 mb-1">
                      Key Points (Optional)
                    </label>
                    <input
                      {...register('keyPoints')}
                      id="keyPoints"
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Comma-separated key points to include..."
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating Email...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Email
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Generated Email */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Generated Email</span>
              </CardTitle>
              <CardDescription>AI-drafted email ready to send</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedEmail ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {generatedEmail}
                    </pre>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Open in Email
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Email Generated</h3>
                  <p className="text-gray-600">
                    Select an email type and provide details to generate your AI-powered email draft.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Tips */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Email Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-1">Outreach</h4>
                <p className="text-blue-700">Keep it concise, highlight creator's unique value, and include relevant metrics.</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-1">Negotiation</h4>
                <p className="text-green-700">Be clear about terms, timeline, and deliverables. Leave room for discussion.</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-1">Follow-up</h4>
                <p className="text-purple-700">Be polite, reference previous communication, and provide a clear next step.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 