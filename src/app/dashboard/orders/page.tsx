"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  modifications: string[];
  notes?: string;
}

interface Order {
  id: string;
  tableId?: string;
  tableName: string;
  customer: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  type: 'dine-in' | 'takeout' | 'delivery' | 'online';
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt: string;
  estimatedTime: number;
}

export default function OrdersManagement() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        tableId: 'table-5',
        tableName: 'Table 5',
        customer: 'John Smith',
        items: [
          { menuItemId: '1', name: 'Grilled Atlantic Salmon', quantity: 1, price: 24.99, modifications: [], notes: 'Medium rare' },
          { menuItemId: '2', name: 'Caesar Salad', quantity: 1, price: 12.50, modifications: ['No croutons'], notes: '' }
        ],
        status: 'preparing',
        type: 'dine-in',
        subtotal: 37.49,
        tax: 3.37,
        tip: 7.50,
        total: 48.36,
        paymentStatus: 'pending',
        notes: 'Customer has food allergies',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        estimatedTime: 15
      },
      {
        id: 'ORD-002',
        tableId: 'table-12',
        tableName: 'Table 12',
        customer: 'Sarah Johnson',
        items: [
          { menuItemId: '3', name: 'Classic Beef Burger', quantity: 2, price: 16.99, modifications: ['Extra cheese'], notes: '' },
          { menuItemId: '4', name: 'Fresh Orange Juice', quantity: 2, price: 4.99, modifications: [], notes: '' }
        ],
        status: 'ready',
        type: 'dine-in',
        subtotal: 43.96,
        tax: 3.96,
        tip: 8.80,
        total: 56.72,
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        estimatedTime: 5
      },
      {
        id: 'ORD-003',
        tableId: 'online',
        tableName: 'Online Order',
        customer: 'Mike Wilson',
        items: [
          { menuItemId: '5', name: 'Chocolate Lava Cake', quantity: 1, price: 8.99, modifications: [], notes: 'Extra ice cream' },
          { menuItemId: '6', name: 'Crispy Calamari', quantity: 1, price: 12.99, modifications: [], notes: '' }
        ],
        status: 'confirmed',
        type: 'takeout',
        subtotal: 21.98,
        tax: 1.98,
        tip: 0,
        total: 23.96,
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        estimatedTime: 20
      }
    ];
    
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'served': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'dine-in': return 'bg-blue-50 text-blue-700';
      case 'takeout': return 'bg-green-50 text-green-700';
      case 'delivery': return 'bg-purple-50 text-purple-700';
      case 'online': return 'bg-orange-50 text-orange-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by status tab
    if (selectedStatus === 'active') {
      filtered = filtered.filter(order => 
        ['pending', 'confirmed', 'preparing', 'ready'].includes(order.status)
      );
    } else if (selectedStatus === 'completed') {
      filtered = filtered.filter(order => 
        ['served', 'completed'].includes(order.status)
      );
    } else if (selectedStatus === 'cancelled') {
      filtered = filtered.filter(order => order.status === 'cancelled');
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tableName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getTimeSince = (dateString: string) => {
    const minutes = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600">Track and manage all restaurant orders</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">Export Orders</Button>
          <Button>New Order (POS)</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">#</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ready to Serve</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'ready').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Prep Time</p>
                <p className="text-2xl font-bold">18m</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm font-bold">⏱</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-2xl font-bold">$2,845</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search orders by ID, customer, or table..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Orders Tabs */}
      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="space-y-4">
          {getFilteredOrders().map(order => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.tableName} • {order.customer}
                      </p>
                    </div>
                    <Badge className={getTypeColor(order.type)}>
                      {order.type}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <p className="text-sm text-gray-500">{getTimeSince(order.createdAt)}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="font-medium">{item.quantity}x {item.name}</p>
                          {item.modifications.length > 0 && (
                            <p className="text-xs text-gray-600">
                              Modifications: {item.modifications.join(', ')}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-xs text-gray-600">Notes: {item.notes}</p>
                          )}
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Notes */}
                {order.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Special Notes</h4>
                    <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-2">
                      {order.notes}
                    </p>
                  </div>
                )}

                {/* Order Summary */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">Total: <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span></p>
                    <div className="flex items-center space-x-4">
                      <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {order.paymentStatus}
                      </Badge>
                      {order.status === 'preparing' && (
                        <p className="text-sm text-orange-600">
                          Est. {order.estimatedTime} minutes remaining
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <Button 
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button 
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                      >
                        Start Preparing
                      </Button>
                    )}
                    {order.status === 'preparing' && (
                      <Button 
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                      >
                        Mark Ready
                      </Button>
                    )}
                    {order.status === 'ready' && (
                      <Button 
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'served')}
                      >
                        Mark Served
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {['pending', 'confirmed'].includes(order.status) && (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {getFilteredOrders().length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">No orders found matching your criteria.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}