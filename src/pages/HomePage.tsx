import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Zap, Palette, Shield, ArrowRight, Star, Users, Image, Wand2, Layers, Cpu } from 'lucide-react';
import { useAppSelector } from '@/store';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate stunning images in seconds with our optimized AI models',
      gradient: 'from-yellow-400 to-orange-600',
    },
    {
      icon: Palette,
      title: '15+ Art Styles',
      description: 'From realistic to abstract, find the perfect style for your vision',
      gradient: 'from-pink-500 to-purple-600',
    },
    {
      icon: Shield,
      title: 'Safe & Private',
      description: 'Your creations are secure and private, with full ownership rights',
      gradient: 'from-green-500 to-teal-600',
    },
    {
      icon: Star,
      title: 'High Quality',
      description: 'Create images up to 4K resolution with incredible detail',
      gradient: 'from-blue-500 to-indigo-600',
    },
  ];

  const stats = [
    { value: '1M+', label: 'Images Created' },
    { value: '50K+', label: 'Happy Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '< 10s', label: 'Avg. Generation' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            style={{ y: y1, opacity }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl"
          />
          <motion.div
            style={{ y: y2, opacity }}
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl"
          />
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        </div>

        {/* Geometric Shapes */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20 w-32 h-32"
        >
          <div className="w-full h-full border-2 border-purple-500/20 rounded-lg transform rotate-45" />
        </motion.div>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-20 w-24 h-24"
        >
          <div className="w-full h-full border-2 border-blue-500/20 rounded-full" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex items-center min-h-[calc(100vh-72px)]">
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6"
              >
                <Sparkles className="h-4 w-4" />
                <span>Powered by Advanced AI Technology</span>
              </motion.div>
              
              <h1 className="text-6xl lg:text-8xl font-bold mb-6 leading-tight">
                <span className="text-white">AI Image</span>{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Generator
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Generate images from text prompts using AI models.
              </p>
              
              <div className="text-sm text-gray-400 mb-12 max-w-2xl mx-auto">
                <p className="mb-2"><strong>Built with:</strong> React 19, TypeScript, Firebase, Tailwind CSS, Redux Toolkit</p>
                <p><strong>Features:</strong> Text-to-image generation, user authentication, image gallery, responsive design</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link to={isAuthenticated ? '/create' : '/register'}>
                  <Button 
                    size="xl" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                    leftIcon={<Wand2 className="h-5 w-5" />}
                  >
                    Start Creating Free
                  </Button>
                </Link>
                <Link to="/gallery">
                  <Button 
                    size="xl" 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Explore Gallery
                  </Button>
                </Link>
              </div>

            </motion.div>

            {/* Hero Images Grid */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                {[
                  {
                    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
                    style: 'Abstract Art',
                  },
                  {
                    src: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop',
                    style: 'Digital Art',
                  },
                  {
                    src: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop',
                    style: '3D Render',
                  },
                  {
                    src: 'https://images.unsplash.com/photo-1643101681449-c8c4e2b8a540?w=400&h=400&fit=crop',
                    style: 'Surrealism',
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                    className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl group"
                  >
                    <img src={item.src} alt={`AI Art ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-medium">{item.style}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -left-4 top-8 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Lightning Fast
                </span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -right-4 bottom-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  15+ Styles
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6"
            >
              <Star className="h-4 w-4" />
              <span>Why Creators Love Us</span>
            </motion.div>
            
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to unleash your creativity and bring your ideas to life
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card 
                    variant="elevated" 
                    className="h-full relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${feature.gradient}`} />
                    <div className="relative p-8">
                      <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Creators Worldwide
            </h2>
            <p className="text-xl text-white/80">
              Join our growing community of digital artists
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="inline-block"
                >
                  <div className="text-5xl lg:text-6xl font-bold text-white mb-2 drop-shadow-lg">
                    {stat.value}
                  </div>
                  <div className="text-lg text-white/90 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -100, 0],
              y: [0, 50, 0]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-medium mb-8"
            >
              <Sparkles className="h-4 w-4" />
              <span>Limited Time Offer</span>
            </motion.div>

            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Create Your{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Masterpiece?
              </span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              An open-source AI image generation tool for everyone. 
              Start your creative journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to={isAuthenticated ? '/create' : '/register'}>
                <Button 
                  size="xl" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
                  leftIcon={<Wand2 className="h-5 w-5" />}
                >
                  Start Creating Now
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 text-gray-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-gray-900"
                    />
                  ))}
                </div>
                <p className="text-sm">
                  <span className="text-white font-semibold">50K+</span> creators already onboard
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              <div className="text-center">
                <Cpu className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">AI Powered</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Safe & Secure</p>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Community</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;