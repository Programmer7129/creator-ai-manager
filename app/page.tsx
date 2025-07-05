'use client'

import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/libs/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/libs/ui/card'
import { BackgroundAnimation } from '@/libs/ui/background-animation'
import { 
  Brain, 
  Calendar, 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Shield,
  Zap,
  BarChart3,
  Mail
} from 'lucide-react'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Insights",
      description: "Get intelligent content suggestions and optimal posting times based on your audience data and trending topics."
    },
    {
      icon: <Calendar className="h-8 w-8 text-green-600" />,
      title: "Smart Scheduling",
      description: "Automate your content calendar with AI-driven scheduling that maximizes engagement and reach."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Multi-Creator Management",
      description: "Manage multiple creators from a single dashboard with role-based access and collaboration tools."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
      title: "Brand Partnership Tracking",
      description: "Track deals, manage contracts, and get AI assistance for negotiations with automated workflows."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-pink-600" />,
      title: "Automated Communications",
      description: "Draft professional emails and responses with AI while maintaining your authentic voice."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-indigo-600" />,
      title: "Performance Analytics",
      description: "Get detailed insights into content performance, audience growth, and revenue optimization."
    }
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
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
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden">
      <BackgroundAnimation />
      
      {/* Header */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CreatorAI Manager
          </span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button 
            onClick={() => router.push('/auth/signin')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Get Started
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Revolutionize Your
            <br />
            Creator Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate AI-powered platform for talent managers and agencies. Streamline content creation, 
            automate brand partnerships, and scale your creator management with intelligent insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
              onClick={() => router.push('/auth/signin')}
            >
              Start Your Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4"
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Scale
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From AI-powered content suggestions to automated brand partnerships, 
            we've got every aspect of creator management covered.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="py-16">
              <h2 className="text-4xl font-bold mb-4">
                Ready to Transform Your Creator Management?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join the future of influencer management with AI-powered automation and insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white text-blue-600 hover:bg-blue-50 border-white text-lg px-8 py-4"
                  onClick={() => router.push('/auth/signin')}
                >
                  Start Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 text-lg px-8 py-4"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-center">
        <div className="border-t border-gray-200 pt-8">
          <p className="text-gray-600">
            © 2024 CreatorAI Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  )
}
