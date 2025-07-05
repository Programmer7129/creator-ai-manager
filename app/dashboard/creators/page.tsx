'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/libs/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/libs/ui/card'
import { Modal } from '@/libs/ui/modal'
import { Header } from '@/components/header'
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Instagram,
  Youtube,
  Music,
  DollarSign,
  Calendar,
  TrendingUp,
  Mail,
  ExternalLink
} from 'lucide-react'

const creatorSchema = z.object({
  name: z.string().min(2, 'Creator name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  niche: z.string().min(2, 'Niche must be at least 2 characters'),
  baseRate: z.number().positive('Base rate must be positive').optional(),
  socialHandles: z.object({
    instagram: z.object({
      handle: z.string().optional(),
    }).optional(),
    youtube: z.object({
      handle: z.string().optional(),
    }).optional(),
    tiktok: z.object({
      handle: z.string().optional(),
    }).optional(),
  }).optional(),
})

type CreatorFormData = z.infer<typeof creatorSchema>

interface Creator {
  id: string
  name: string
  email?: string
  niche: string
  baseRate?: number
  socialHandles: any
  metrics?: any
  _count: {
    deals: number
    scheduledPosts: number
  }
  createdAt: string
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatorFormData>({
    resolver: zodResolver(creatorSchema)
  })

  const fetchCreators = async () => {
    try {
      const response = await fetch('/api/creators')
      if (response.ok) {
        const data = await response.json()
        setCreators(data)
      } else {
        console.error('Failed to fetch creators')
      }
    } catch (error) {
      console.error('Error fetching creators:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCreators()
  }, [])

  const onSubmit = async (data: CreatorFormData) => {
    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        ...data,
        email: data.email || undefined,
        socialHandles: data.socialHandles || {},
      }

      const response = await fetch('/api/creators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create creator')
      }

      const newCreator = await response.json()
      setCreators(prev => [newCreator, ...prev])
      setShowAddModal(false)
      reset()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteCreator = async (id: string) => {
    if (!confirm('Are you sure you want to delete this creator? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/creators/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete creator')
      }

      setCreators(prev => prev.filter(creator => creator.id !== id))
    } catch (error) {
      console.error('Error deleting creator:', error)
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-4 w-4" />
      case 'youtube':
        return <Youtube className="h-4 w-4" />
      case 'tiktok':
        return <Music className="h-4 w-4" />
      default:
        return null
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

  if (isLoading) {
    return (
      <div className="p-6">
        <Header title="Creators" subtitle="Manage your talent roster" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Header 
        title="Creators" 
        subtitle={`Manage your ${creators.length} talented creator${creators.length !== 1 ? 's' : ''}`}
        actions={
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Creator
          </Button>
        }
      />

      {creators.length === 0 ? (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-center py-16"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No creators yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first creator to the platform.</p>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Creator
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.id}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          {creator.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{creator.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {creator.niche}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600 hover:text-red-800"
                        onClick={() => deleteCreator(creator.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Social Handles */}
                  {creator.socialHandles && Object.keys(creator.socialHandles).length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Social Platforms</p>
                      <div className="flex space-x-2">
                        {Object.entries(creator.socialHandles).map(([platform, data]: [string, any]) => {
                          if (data?.handle) {
                            return (
                              <div key={platform} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-lg">
                                {getSocialIcon(platform)}
                                <span className="text-xs text-gray-600">@{data.handle}</span>
                                <ExternalLink className="h-3 w-3 text-gray-400" />
                              </div>
                            )
                          }
                          return null
                        })}
                      </div>
                    </div>
                  )}

                  {/* Contact */}
                  {creator.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{creator.email}</span>
                    </div>
                  )}

                  {/* Base Rate */}
                  {creator.baseRate && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>${creator.baseRate}/post</span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">{creator._count.deals}</p>
                      <p className="text-xs text-gray-600 flex items-center justify-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Deals
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">{creator._count.scheduledPosts}</p>
                      <p className="text-xs text-gray-600 flex items-center justify-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Posts
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Creator Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Creator"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Creator Name *
              </label>
              <input
                {...register('name')}
                id="name"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Sarah Johnson"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="sarah@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="niche" className="block text-sm font-medium text-gray-700 mb-1">
                Niche *
              </label>
              <input
                {...register('niche')}
                id="niche"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Fashion, Tech, Fitness"
              />
              {errors.niche && (
                <p className="text-red-600 text-sm mt-1">{errors.niche.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="baseRate" className="block text-sm font-medium text-gray-700 mb-1">
                Base Rate ($)
              </label>
              <input
                {...register('baseRate', { valueAsNumber: true })}
                id="baseRate"
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="500"
              />
              {errors.baseRate && (
                <p className="text-red-600 text-sm mt-1">{errors.baseRate.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Social Media Handles
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="instagram" className="block text-xs font-medium text-gray-600 mb-1">
                  Instagram
                </label>
                <input
                  {...register('socialHandles.instagram.handle')}
                  id="instagram"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="@username"
                />
              </div>

              <div>
                <label htmlFor="youtube" className="block text-xs font-medium text-gray-600 mb-1">
                  YouTube
                </label>
                <input
                  {...register('socialHandles.youtube.handle')}
                  id="youtube"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="@channel"
                />
              </div>

              <div>
                <label htmlFor="tiktok" className="block text-xs font-medium text-gray-600 mb-1">
                  TikTok
                </label>
                <input
                  {...register('socialHandles.tiktok.handle')}
                  id="tiktok"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="@username"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Creator'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
} 