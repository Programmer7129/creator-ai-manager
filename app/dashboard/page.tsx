'use client'

import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/libs/ui/card'
import { Button } from '@/libs/ui/button'
import { Header } from '@/components/header'
import {
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  MessageSquare,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  Heart,
  Share2
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session } = useSession()

  const stats = [
    {
      title: 'Total Creators',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Deals',
      value: '8',
      change: '+3',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Monthly Revenue',
      value: '$24,500',
      change: '+12%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Scheduled Posts',
      value: '47',
      change: '+8',
      changeType: 'increase',
      icon: Calendar,
      color: 'text-orange-600'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'deal',
      title: 'New brand deal inquiry',
      description: 'Fashion Nova wants to collaborate with @sarah_style',
      time: '5 minutes ago',
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      type: 'post',
      title: 'Post published successfully',
      description: 'Instagram reel for @mikefitness went live',
      time: '1 hour ago',
      icon: Activity,
      color: 'bg-green-500'
    },
    {
      id: 3,
      type: 'message',
      title: 'AI suggestion available',
      description: 'Content ideas ready for @food_blogger',
      time: '2 hours ago',
      icon: MessageSquare,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      type: 'creator',
      title: 'New creator onboarded',
      description: '@tech_reviewer joined your agency',
      time: '1 day ago',
      icon: Users,
      color: 'bg-orange-500'
    }
  ]

  const topCreators = [
    {
      name: 'Sarah Johnson',
      handle: '@sarah_style',
      avatar: '/api/placeholder/40/40',
      followers: '125K',
      engagement: '4.2%',
      revenue: '$3,200'
    },
    {
      name: 'Mike Chen',
      handle: '@mikefitness',
      avatar: '/api/placeholder/40/40',
      followers: '89K',
      engagement: '3.8%',
      revenue: '$2,800'
    },
    {
      name: 'Alex Rivera',
      handle: '@tech_reviewer',
      avatar: '/api/placeholder/40/40',
      followers: '156K',
      engagement: '5.1%',
      revenue: '$4,100'
    }
  ]

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

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="mb-8">
        <Header 
          title="Dashboard" 
          subtitle={`Welcome back, ${session?.user?.name || 'there'}! Here's what's happening with your creators.`}
        />
      </div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    {stat.changeType === 'increase' ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div 
          className="lg:col-span-2"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your creators and campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Creators */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Your highest-earning creators this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topCreators.map((creator, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {creator.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{creator.name}</p>
                    <p className="text-xs text-gray-600">{creator.handle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{creator.revenue}</p>
                    <p className="text-xs text-gray-600">{creator.followers}</p>
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  View All Creators
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with these common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <Plus className="h-6 w-6" />
                <span>Add Creator</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span>Schedule Post</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>New Deal</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <MessageSquare className="h-6 w-6" />
                <span>AI Assistant</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 