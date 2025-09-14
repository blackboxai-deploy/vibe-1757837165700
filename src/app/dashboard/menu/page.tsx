"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from "sonner";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
  dietary: string[];
  preparationTime: number;
  categoryId: string;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
  available: boolean;
}

export default function MenuManagement() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    preparationTime: '15',
    dietary: [] as string[],
    ingredients: '',
    available: true
  });

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/menu/items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      } else {
        toast.error('Failed to fetch menu data');
      }
    } catch (error) {
      toast.error('Error loading menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.categoryId || !newItem.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/menu/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newItem,
          ingredients: newItem.ingredients.split(',').map(i => i.trim()).filter(Boolean)
        })
      });

      if (response.ok) {
        toast.success('Menu item added successfully');
        setIsAddDialogOpen(false);
        setNewItem({
          name: '',
          description: '',
          price: '',
          categoryId: '',
          preparationTime: '15',
          dietary: [],
          ingredients: '',
          available: true
        });
        fetchMenuData();
      } else {
        toast.error('Failed to add menu item');
      }
    } catch (error) {
      toast.error('Error adding menu item');
    }
  };

  const toggleDietary = (dietary: string) => {
    setNewItem(prev => ({
      ...prev,
      dietary: prev.dietary.includes(dietary)
        ? prev.dietary.filter(d => d !== dietary)
        : [...prev.dietary, dietary]
    }));
  };

  const filteredCategories = categories.filter(category => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) return false;
    if (searchTerm) {
      return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             category.items.some(item => 
               item.name.toLowerCase().includes(searchTerm.toLowerCase())
             );
    }
    return true;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant's menu items and categories</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Menu Item</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Grilled Salmon"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newItem.categoryId} onValueChange={(value) => setNewItem(prev => ({ ...prev, categoryId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the dish..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                  <Input
                    id="prepTime"
                    type="number"
                    value={newItem.preparationTime}
                    onChange={(e) => setNewItem(prev => ({ ...prev, preparationTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Ingredients (comma-separated)</Label>
                <Input
                  id="ingredients"
                  value={newItem.ingredients}
                  onChange={(e) => setNewItem(prev => ({ ...prev, ingredients: e.target.value }))}
                  placeholder="salmon, lemon, herbs, vegetables"
                />
              </div>

              <div className="space-y-2">
                <Label>Dietary Information</Label>
                <div className="flex flex-wrap gap-2">
                  {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'spicy'].map(dietary => (
                    <Badge
                      key={dietary}
                      variant={newItem.dietary.includes(dietary) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleDietary(dietary)}
                    >
                      {dietary}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={newItem.available}
                  onCheckedChange={(checked) => setNewItem(prev => ({ ...prev, available: checked }))}
                />
                <Label htmlFor="available">Available for ordering</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by category" />
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
      <div className="space-y-6">
        {filteredCategories.map(category => (
          <Card key={category.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    {category.name}
                    <Badge variant="secondary">
                      {category.items.length} items
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </div>
                <Badge variant={category.available ? 'default' : 'secondary'}>
                  {category.available ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map(item => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center">
                      <img 
                        src={`https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c6e34f33-f0fe-4a88-82cb-9e5393107350.png + '+professional+restaurant+food+photography')}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `<div class="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm">${item.name}</div>`;
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">${item.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{item.preparationTime}min</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {item.dietary.map(dietary => (
                          <Badge key={dietary} variant="outline" className="text-xs">
                            {dietary}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <Badge variant={item.available ? 'default' : 'secondary'}>
                          {item.available ? 'Available' : 'Unavailable'}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">
                            {item.available ? 'Disable' : 'Enable'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}