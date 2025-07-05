'use client'

import { motion } from 'framer-motion'

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Floating Blob 1 */}
        <motion.path
          d="M200,300 C280,250 380,280 420,360 C450,440 380,520 300,520 C220,520 150,440 150,360 C150,320 170,300 200,300 Z"
          fill="url(#gradient1)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        
        {/* Floating Blob 2 */}
        <motion.path
          d="M600,200 C720,180 800,240 820,360 C840,480 760,580 640,580 C520,580 460,480 460,360 C460,280 520,200 600,200 Z"
          fill="url(#gradient2)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.08 }}
          transition={{ duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
        />
        
        {/* Floating Blob 3 */}
        <motion.path
          d="M300,700 C420,680 520,720 540,820 C560,920 480,980 380,980 C280,980 220,920 200,820 C180,720 220,680 300,700 Z"
          fill="url(#gradient3)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.06 }}
          transition={{ duration: 3, ease: 'easeInOut', delay: 1 }}
        />

        {/* Floating Blob 4 */}
        <motion.path
          d="M750,650 C850,630 920,690 930,790 C940,890 870,950 770,950 C670,950 630,890 630,790 C630,730 670,650 750,650 Z"
          fill="url(#gradient4)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.05 }}
          transition={{ duration: 2.8, ease: 'easeInOut', delay: 1.5 }}
        />

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>

      {/* Animated floating elements */}
      <motion.div
        className="absolute top-20 left-20 w-4 h-4 bg-blue-400 rounded-full opacity-20"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute top-40 right-32 w-6 h-6 bg-purple-400 rounded-full opacity-15"
        animate={{
          y: [0, 25, 0],
          x: [0, -15, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      
      <motion.div
        className="absolute bottom-32 left-40 w-3 h-3 bg-green-400 rounded-full opacity-25"
        animate={{
          y: [0, -15, 0],
          x: [0, 20, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-5 h-5 bg-pink-400 rounded-full opacity-20"
        animate={{
          y: [0, 20, 0],
          x: [0, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />
    </div>
  )
} 