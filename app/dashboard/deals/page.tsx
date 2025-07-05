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
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  User,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react'

const dealSchema = z.object({
  brand: z.string().min(2, 'Brand name must be at least 2 characters'),
  creatorId: z.string().min(1, 'Creator is required'),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactName: z.string().optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  currency: z.string().default('USD'),
  status: z.enum(['PENDING', 'NEGOTIATING', 'ACTIVE', 'COMPLETED', 'CANCELLED']).default('PENDING'),
  description: z.string().optional(),
  deliverables: z.string().optional(),
  nextActionAt: z.string().optional(),
  contractUrl: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
})

type DealFormData = z.infer<typeof dealSchema>

interface Deal {
  id: string
  brand: string
  contactEmail?: string
  contactName?: string
  amount?: number
  currency: string
  status: 'PENDING' | 'NEGOTIATING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  description?: string
  deliverables?: any
  nextActionAt?: string
  contractUrl?: string
  notes?: string
  creator: {
    id: string
    name: string
    niche: string
    socialHandles: any
  }
  createdAt: string
  updatedAt: string
}

interface Creator {
  id: string
  name: string
  niche: string
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [creators, setCreators] = useState<Creator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema)
  })

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals')
      if (response.ok) {
        const data = await response.json()
        setDeals(data)
      } else {
        console.error('Failed to fetch deals')
      }
    } catch (error) {
      console.error('Error fetching deals:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
    }
  }

  useEffect(() => {
    fetchDeals()
    fetchCreators()
  }, [])

  const onSubmit = async (data: DealFormData) => {
    setIsSubmitting(true)
    setError('')

    try {
      const payload = {
        ...data,
        amount: data.amount ? Number(data.amount) : undefined,
        contactEmail: data.contactEmail || undefined,
        contractUrl: data.contractUrl || undefined,
        nextActionAt: data.nextActionAt || undefined,
        deliverables: data.deliverables ? [data.deliverables] : undefined,
      }

      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create deal')
      }

      const newDeal = await response.json()
      setDeals(prev => [newDeal, ...prev])
      setShowAddModal(false)
      reset()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateDealStatus = async (dealId: string, newStatus: Deal['status']) => {
    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update deal status')
      }

      const updatedDeal = await response.json()
      setDeals(prev => prev.map(deal => 
        deal.id === dealId ? updatedDeal : deal
      ))
    } catch (error) {
      console.error('Error updating deal status:', error)
    }
  }

  const deleteDeal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete deal')
      }

      setDeals(prev => prev.filter(deal => deal.id !== id))
    } catch (error) {
      console.error('Error deleting deal:', error)
    }
  }

  const getStatusIcon = (status: Deal['status']) => {
    switch (status) {
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'NEGOTIATING':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'ACTIVE':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: Deal['status']) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'NEGOTIATING':
        return 'bg-orange-100 text-orange-800'
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredDeals = deals.filter(deal => 
    statusFilter === 'all' || deal.status === statusFilter
  )

  const dealStats = {
    total: deals.length,
    pending: deals.filter(d => d.status === 'PENDING').length,
    active: deals.filter(d => d.status === 'ACTIVE').length,
    completed: deals.filter(d => d.status === 'COMPLETED').length,
    totalValue: deals.reduce((sum, deal) => sum + (deal.amount || 0), 0),
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
        <Header title="Brand Deals" subtitle="Manage your brand partnerships" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Header 
        title="Brand Deals" 
        subtitle={`Track and manage ${deals.length} brand partnership${deals.length !== 1 ? 's' : ''}`}
        actions={
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deals</p>
                <p className="text-2xl font-bold text-gray-900">{dealStats.total}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{dealStats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-blue-600">{dealStats.active}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{dealStats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${dealStats.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Filter className="h-5 w-5 text-gray-600" />
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="NEGOTIATING">Negotiating</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {filteredDeals.length === 0 ? (
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-center py-16"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {statusFilter === 'all' ? 'No deals yet' : `No ${statusFilter.toLowerCase()} deals`}
          </h3>
          <p className="text-gray-600 mb-6">
            {statusFilter === 'all' 
              ? 'Get started by adding your first brand deal to track partnerships.'
              : `There are no ${statusFilter.toLowerCase()} deals to display.`
            }
          </p>
          {statusFilter === 'all' && (
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Deal
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg truncate">{deal.brand}</CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deal.status)}`}>
                          {deal.status}
                        </span>
                      </div>
                      <CardDescription className="flex items-center space-x-2">
                        <Building className="h-4 w-4" />
                        <span>{deal.contactName || 'No contact'}</span>
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600 hover:text-red-800"
                        onClick={() => deleteDeal(deal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Creator */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{deal.creator.name}</span>
                    <span className="text-gray-400">•</span>
                    <span>{deal.creator.niche}</span>
                  </div>

                  {/* Amount */}
                  {deal.amount && (
                    <div className="flex items-center space-x-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-600">${deal.amount.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Next Action */}
                  {deal.nextActionAt && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Next: {new Date(deal.nextActionAt).toLocaleDateString()}</span>
                    </div>
                  )}

                  {/* Description */}
                  {deal.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{deal.description}</p>
                  )}

                  {/* Status Actions */}
                  <div className="pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                      {deal.status === 'PENDING' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateDealStatus(deal.id, 'NEGOTIATING')}
                            className="text-orange-600 border-orange-600 hover:bg-orange-50"
                          >
                            Start Negotiating
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateDealStatus(deal.id, 'ACTIVE')}
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            Activate
                          </Button>
                        </>
                      )}
                      {deal.status === 'NEGOTIATING' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateDealStatus(deal.id, 'ACTIVE')}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          Activate Deal
                        </Button>
                      )}
                      {deal.status === 'ACTIVE' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateDealStatus(deal.id, 'COMPLETED')}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          Mark Complete
                        </Button>
                      )}
                      {(deal.status === 'PENDING' || deal.status === 'NEGOTIATING' || deal.status === 'ACTIVE') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateDealStatus(deal.id, 'CANCELLED')}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Deal Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Deal"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name *
              </label>
              <input
                {...register('brand')}
                id="brand"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Nike"
              />
              {errors.brand && (
                <p className="text-red-600 text-sm mt-1">{errors.brand.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name
              </label>
              <input
                {...register('contactName')}
                id="contactName"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Sarah Johnson"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="creatorId" className="block text-sm font-medium text-gray-700 mb-1">
                Creator *
              </label>
              <select
                {...register('creatorId')}
                id="creatorId"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Creator</option>
                {creators.map(creator => (
                  <option key={creator.id} value={creator.id}>
                    {creator.name} - {creator.niche}
                  </option>
                ))}
              </select>
              {errors.creatorId && (
                <p className="text-red-600 text-sm mt-1">{errors.creatorId.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                {...register('contactEmail')}
                id="contactEmail"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@brand.com"
              />
              {errors.contactEmail && (
                <p className="text-red-600 text-sm mt-1">{errors.contactEmail.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                {...register('amount', { valueAsNumber: true })}
                id="amount"
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2500"
              />
              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PENDING">Pending</option>
                <option value="NEGOTIATING">Negotiating</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nextActionAt" className="block text-sm font-medium text-gray-700 mb-1">
                Next Action Date
              </label>
              <input
                {...register('nextActionAt')}
                id="nextActionAt"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="contractUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Contract URL
              </label>
              <input
                {...register('contractUrl')}
                id="contractUrl"
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/contract"
              />
              {errors.contractUrl && (
                <p className="text-red-600 text-sm mt-1">{errors.contractUrl.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of the deal..."
            />
          </div>

          <div>
            <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700 mb-1">
              Deliverables
            </label>
            <textarea
              {...register('deliverables')}
              id="deliverables"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What will be delivered..."
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional notes..."
            />
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
              {isSubmitting ? 'Creating...' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
} 