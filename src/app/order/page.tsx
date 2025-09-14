"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from "sonner";
import Link from 'next/link';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  dietary: string[];
  preparationTime: number;
  categoryId: string;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  modifications: string[];
  notes: string;
  subtotal: number;
}

export default function CustomerOrderPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'takeout' as 'takeout' | 'dine-in' | 'delivery'
  });

  // Mock data for menu items
  useEffect(() => {
    const fetchMenu = async () => {
      // Simulate API call
      const mockCategories: MenuCategory[] = [
        {
          id: 'appetizers',
          name: 'Appetizers',
          description: 'Start your meal right',
          items: [
            {
              id: 'app1',
              name: 'Crispy Calamari',
              description: 'Fresh squid rings served with marinara sauce and lemon',
              price: 12.99,
              dietary: [],
              preparationTime: 10,
              categoryId: 'appetizers'
            },
            {
              id: 'app2',
              name: 'Bruschetta Trio',
              description: 'Three varieties of toasted bread with fresh toppings',
              price: 9.99,
              dietary: ['vegetarian'],
              preparationTime: 8,
              categoryId: 'appetizers'
            }
          ]
        },
        {
          id: 'mains',
          name: 'Main Courses',
          description: 'Hearty and satisfying dishes',
          items: [
            {
              id: 'main1',
              name: 'Grilled Atlantic Salmon',
              description: 'Fresh salmon with lemon herb butter and seasonal vegetables',
              price: 24.99,
              dietary: ['gluten-free'],
              preparationTime: 20,
              categoryId: 'mains'
            },
            {
              id: 'main2',
              name: 'Classic Beef Burger',
              description: 'Angus beef patty with lettuce, tomato, pickles, and fries',
              price: 16.99,
              dietary: [],
              preparationTime: 15,
              categoryId: 'mains'
            },
            {
              id: 'main3',
              name: 'Vegetarian Pasta Primavera',
              description: 'Fresh vegetables and pasta in a light cream sauce',
              price: 18.50,
              dietary: ['vegetarian'],
              preparationTime: 18,
              categoryId: 'mains'
            }
          ]
        },
        {
          id: 'desserts',
          name: 'Desserts',
          description: 'Sweet endings to your meal',
          items: [
            {
              id: 'dess1',
              name: 'Chocolate Lava Cake',
              description: 'Warm chocolate cake with molten center and vanilla ice cream',
              price: 8.99,
              dietary: ['vegetarian'],
              preparationTime: 12,
              categoryId: 'desserts'
            }
          ]
        },
        {
          id: 'beverages',
          name: 'Beverages',
          description: 'Refreshing drinks and more',
          items: [
            {
              id: 'bev1',
              name: 'Fresh Orange Juice',
              description: 'Freshly squeezed orange juice',
              price: 4.99,
              dietary: ['vegan', 'gluten-free'],
              preparationTime: 2,
              categoryId: 'beverages'
            },
            {
              id: 'bev2',
              name: 'Craft Beer Selection',
              description: 'Ask server for today\'s selection',
              price: 6.50,
              dietary: [],
              preparationTime: 1,
              categoryId: 'beverages'
            }
          ]
        }
      ];

      setCategories(mockCategories);
      setLoading(false);
    };

    fetchMenu();
  }, []);

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.menuItem.id === item.id);
    
    if (existingItem) {
      setCart(prev => prev.map(cartItem =>
        cartItem.menuItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1, subtotal: (cartItem.quantity + 1) * item.price }
          : cartItem
      ));
    } else {
      setCart(prev => [...prev, {
        menuItem: item,
        quantity: 1,
        modifications: [],
        notes: '',
        subtotal: item.price
      }]);
    }
    
    toast.success(`${item.name} added to cart`);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.menuItem.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prev => prev.map(cartItem =>
      cartItem.menuItem.id === itemId
        ? { ...cartItem, quantity, subtotal: quantity * cartItem.menuItem.price }
        : cartItem
    ));
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const getTax = () => {
    return getCartSubtotal() * 0.09; // 9% tax
  };

  const getTotal = () => {
    return getCartSubtotal() + getTax();
  };

  const getDietaryBadgeColor = (dietary: string) => {
    switch (dietary) {
      case 'vegetarian': return 'bg-green-100 text-green-800';
      case 'vegan': return 'bg-green-100 text-green-800';
      case 'gluten-free': return 'bg-blue-100 text-blue-800';
      case 'dairy-free': return 'bg-yellow-100 text-yellow-800';
      case 'nut-free': return 'bg-orange-100 text-orange-800';
      case 'spicy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCategories = categories.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return false;
    if (searchTerm) {
      return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             category.items.some(item => 
               item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               item.description.toLowerCase().includes(searchTerm.toLowerCase())
             );
    }
    return true;
  });

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please fill in your contact information');
      return;
    }
    
    // In a real app, process the order
    toast.success('Order placed successfully! You will receive a confirmation shortly.');
    setCart([]);
    setIsCartOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ROS</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">Demo Restaurant</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                Cart ({getTotalItems()})
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs p-0 flex items-center justify-center">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
              
              <Link href="/auth/login">
                <Button variant="ghost">Staff Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Demo Restaurant
          </h1>
          <p className="text-gray-600">
            Browse our delicious menu and place your order online
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Menu Categories */}
        <div className="space-y-8">
          {filteredCategories.map(category => (
            <section key={category.id}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                <p className="text-gray-600 mt-1">{category.description}</p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map(item => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                      <img 
                        src={`https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ad3600c9-0250-47e2-a62d-9d80c3140e66.png + '+professional+restaurant+food+photography+delicious+plating')}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-medium">${item.name}</div>`;
                        }}
                      />
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">${item.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{item.preparationTime} min</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                      
                      {item.dietary.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.dietary.map(dietary => (
                            <Badge key={dietary} className={getDietaryBadgeColor(dietary)}>
                              {dietary}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <Button 
                        onClick={() => addToCart(item)}
                        className="w-full"
                      >
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Your Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Your Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder="Phone Number *"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <Input
                placeholder="Email (optional)"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
              />
              <Select 
                value={customerInfo.type} 
                onValueChange={(value: 'takeout' | 'dine-in' | 'delivery') => 
                  setCustomerInfo(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="takeout">Takeout</SelectItem>
                  <SelectItem value="dine-in">Dine In</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            {/* Cart Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Order Items</h3>
              
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.menuItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.menuItem.name}</h4>
                        <p className="text-sm text-gray-600">${item.menuItem.price.toFixed(2)} each</p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.menuItem.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        
                        <div className="text-right min-w-20">
                          <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.menuItem.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <>
                <Separator />
                
                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getCartSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (9%):</span>
                    <span>${getTax().toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-12"
                  disabled={cart.length === 0 || !customerInfo.name || !customerInfo.phone}
                >
                  Place Order
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}