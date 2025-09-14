"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data - in real app, fetch from API
  const stats = {
    todaysRevenue: 2845.50,
    activeOrders: 15,
    availableTables: 8,
    totalTables: 20,
    avgOrderTime: 18,
    customersSatisfaction: 4.8,
    staffOnDuty: 12,
    popularItem: 'Grilled Atlantic Salmon'
  };

  const recentOrders = [
    { id: 'ORD-001', table: 'Table 5', items: 3, total: 48.50, status: 'preparing', time: '10m ago' },
    { id: 'ORD-002', table: 'Table 12', items: 2, total: 32.00, status: 'ready', time: '5m ago' },
    { id: 'ORD-003', table: 'Online', items: 4, total: 76.25, status: 'confirmed', time: '2m ago' },
    { id: 'ORD-004', table: 'Table 3', items: 1, total: 15.50, status: 'served', time: '15m ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'served': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening at your restaurant today
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Today's Revenue</CardTitle>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">$</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">${stats.todaysRevenue.toFixed(2)}</div>
            <p className="text-xs text-blue-700 mt-1">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Active Orders</CardTitle>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">#</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.activeOrders}</div>
            <p className="text-xs text-green-700 mt-1">3 ready for serving</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Table Status</CardTitle>
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">T</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {stats.availableTables}/{stats.totalTables}
            </div>
            <p className="text-xs text-purple-700 mt-1">Available tables</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Avg Order Time</CardTitle>
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">⏱</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.avgOrderTime}m</div>
            <p className="text-xs text-orange-700 mt-1">-2m from average</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.table} • {order.items} items</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.total}</p>
                      <p className="text-xs text-gray-500">{order.time}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Performance */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <span className="mr-2">+</span>
                New Order (POS)
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <span className="mr-2">📋</span>
                View Floor Plan
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <span className="mr-2">📊</span>
                Today's Reports
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <span className="mr-2">⚙️</span>
                Restaurant Settings
              </Button>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Today's Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="font-medium">{stats.customersSatisfaction}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Staff on Duty</span>
                <Badge variant="secondary">{stats.staffOnDuty} active</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Most Popular</span>
                <span className="text-sm font-medium text-right">{stats.popularItem}</span>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Table Utilization</span>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}