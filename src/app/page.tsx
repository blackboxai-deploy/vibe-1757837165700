"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ROS</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">RestaurantOS</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Complete Restaurant
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Management</span>
            <br />Platform
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your restaurant operations with our comprehensive SaaS solution. 
            Manage orders, tables, staff, inventory, and analytics - all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/auth/register">
              <Button size="lg" className="h-12 px-8">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/order">
              <Button size="lg" variant="outline" className="h-12 px-8">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
            <h3 className="font-semibold text-blue-900 mb-3">Try Demo Accounts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="text-blue-700">
                <p className="font-medium">Restaurant Owner</p>
                <p>owner@demo.com / demo123</p>
              </div>
              <div className="text-blue-700">
                <p className="font-medium">Manager</p>
                <p>manager@demo.com / demo123</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your Restaurant
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From point-of-sale to analytics, our platform handles every aspect of restaurant management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Point of Sale (POS)',
                description: 'Fast, intuitive order taking with customizable options and real-time kitchen integration.',
                features: ['Order Management', 'Split Bills', 'Multiple Payments', 'Receipt Printing']
              },
              {
                title: 'Table Management',
                description: 'Visual floor plan with reservation system and real-time table status updates.',
                features: ['Interactive Floor Plan', 'Reservations', 'Wait List', 'Table Assignment']
              },
              {
                title: 'Menu Management',
                description: 'Complete menu control with categories, pricing, and availability management.',
                features: ['Menu Categories', 'Dynamic Pricing', 'Dietary Information', 'Photo Management']
              },
              {
                title: 'Staff Management',
                description: 'Employee scheduling, role-based access, and performance tracking.',
                features: ['Shift Scheduling', 'Role Permissions', 'Time Tracking', 'Performance Metrics']
              },
              {
                title: 'Inventory Control',
                description: 'Track stock levels, manage suppliers, and analyze food costs automatically.',
                features: ['Stock Management', 'Supplier Tracking', 'Cost Analysis', 'Low Stock Alerts']
              },
              {
                title: 'Analytics & Reports',
                description: 'Comprehensive business insights with real-time reporting and forecasting.',
                features: ['Sales Analytics', 'Financial Reports', 'Customer Insights', 'Trend Analysis']
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots/Demo Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Beautiful, Intuitive Interface
            </h2>
            <p className="text-lg text-gray-600">
              Designed for efficiency and ease of use across all devices.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Dashboard</h3>
                <p className="text-gray-600">
                  Monitor your restaurant's performance with live metrics, active orders, 
                  and instant notifications.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Responsive</h3>
                <p className="text-gray-600">
                  Access your restaurant data anywhere with our fully responsive design 
                  that works on all devices.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Multi-location Support</h3>
                <p className="text-gray-600">
                  Scale your business with multi-restaurant management and centralized reporting.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 flex items-center justify-center aspect-video">
              <img 
                src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/95c0814b-78da-4ab2-ae9c-9827f6a80cd4.png"
                alt="RestaurantOS Dashboard Interface"
                className="w-full h-full object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = '<div class="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"><p>Dashboard Preview</p></div>';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your restaurant's needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Basic',
                price: '$49',
                period: '/month',
                description: 'Perfect for small restaurants',
                features: ['Up to 10 tables', 'Basic POS', 'Menu management', 'Order tracking', 'Email support'],
                popular: false
              },
              {
                name: 'Professional',
                price: '$99',
                period: '/month',
                description: 'Most popular for growing restaurants',
                features: ['Up to 25 tables', 'Advanced POS', 'Staff management', 'Inventory tracking', 'Analytics dashboard', 'Priority support'],
                popular: true
              },
              {
                name: 'Enterprise',
                price: '$199',
                period: '/month',
                description: 'For large restaurants & chains',
                features: ['Unlimited tables', 'Multi-location', 'Advanced analytics', 'Custom integrations', 'API access', '24/7 dedicated support'],
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-lg' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Restaurant?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of restaurants already using RestaurantOS to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="h-12 px-8">
                Start Free 30-Day Trial
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="h-12 px-8 border-white text-white hover:bg-white hover:text-blue-600">
                Sign In to Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ROS</span>
                </div>
                <h3 className="text-lg font-bold">RestaurantOS</h3>
              </div>
              <p className="text-gray-400">
                The complete restaurant management platform trusted by thousands of restaurants worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RestaurantOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}