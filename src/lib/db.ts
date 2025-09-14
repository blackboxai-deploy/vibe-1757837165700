import { User } from '@/contexts/AuthContext';
import { generateId, hashPassword, getPermissionsByRole } from './auth';

// Data Models
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  cuisine: string;
  logo?: string;
  settings: {
    currency: string;
    timezone: string;
    tableCount: number;
    operatingHours: {
      open: string;
      close: string;
      days: string[];
    };
  };
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'cancelled' | 'suspended';
    expiresAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
  dietary: string[]; // 'vegetarian', 'vegan', 'gluten-free', etc.
  ingredients: string[];
  preparationTime: number; // in minutes
  calories?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  sortOrder: number;
  available: boolean;
  createdAt: string;
}

export interface Table {
  id: string;
  restaurantId: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  position: { x: number; y: number };
  shape: 'round' | 'square' | 'rectangle';
  assignedWaiter?: string;
  currentOrder?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  restaurantId: string;
  tableId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  partySize: number;
  date: string;
  time: string;
  status: 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no-show';
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  tableId?: string;
  customerId?: string;
  items: OrderItem[];
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  type: 'dine-in' | 'takeout' | 'delivery' | 'online';
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  price: number;
  modifications: string[];
  notes?: string;
}

// In-memory data store
class DataStore {
  private data: {
    users: User[];
    restaurants: Restaurant[];
    menuItems: MenuItem[];
    menuCategories: MenuCategory[];
    tables: Table[];
    reservations: Reservation[];
    orders: Order[];
  } = {
    users: [],
    restaurants: [],
    menuItems: [],
    menuCategories: [],
    tables: [],
    reservations: [],
    orders: []
  };

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultData();
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('restaurant_db');
      if (stored) {
        try {
          this.data = JSON.parse(stored);
        } catch (error) {
          console.error('Failed to load data from storage:', error);
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('restaurant_db', JSON.stringify(this.data));
    }
  }

  private initializeDefaultData() {
    if (this.data.restaurants.length === 0) {
      this.createDefaultRestaurant();
    }
  }

  private createDefaultRestaurant() {
    const restaurantId = generateId();
    const restaurant: Restaurant = {
      id: restaurantId,
      name: 'Demo Restaurant',
      address: '123 Main St, City, State 12345',
      phone: '+1 (555) 123-4567',
      email: 'info@demorestaurant.com',
      cuisine: 'American',
      settings: {
        currency: 'USD',
        timezone: 'America/New_York',
        tableCount: 20,
        operatingHours: {
          open: '09:00',
          close: '22:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }
      },
      subscription: {
        plan: 'premium',
        status: 'active',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create demo owner account
    const owner: User = {
      id: generateId(),
      email: 'owner@demo.com',
      name: 'Restaurant Owner',
      role: 'owner',
      restaurantId,
      permissions: getPermissionsByRole('owner'),
      createdAt: new Date().toISOString()
    };

    // Create demo staff
    const manager: User = {
      id: generateId(),
      email: 'manager@demo.com',
      name: 'Restaurant Manager',
      role: 'manager',
      restaurantId,
      permissions: getPermissionsByRole('manager'),
      createdAt: new Date().toISOString()
    };

    this.data.restaurants.push(restaurant);
    this.data.users.push(owner, manager);
    
    // Create default menu categories
    this.createDefaultMenu(restaurantId);
    this.createDefaultTables(restaurantId);
    
    this.saveToStorage();
  }

  private createDefaultMenu(restaurantId: string) {
    const categories = [
      { name: 'Appetizers', description: 'Start your meal right' },
      { name: 'Main Courses', description: 'Hearty and satisfying dishes' },
      { name: 'Desserts', description: 'Sweet endings to your meal' },
      { name: 'Beverages', description: 'Refreshing drinks and more' }
    ];

    categories.forEach((cat, index) => {
      const category: MenuCategory = {
        id: generateId(),
        restaurantId,
        name: cat.name,
        description: cat.description,
        sortOrder: index,
        available: true,
        createdAt: new Date().toISOString()
      };
      this.data.menuCategories.push(category);

      // Add sample menu items for each category
      this.createSampleMenuItems(restaurantId, category.id, cat.name);
    });
  }

  private createSampleMenuItems(restaurantId: string, categoryId: string, categoryName: string) {
    const sampleItems: Record<string, Partial<MenuItem>[]> = {
      'Appetizers': [
        {
          name: 'Crispy Calamari',
          description: 'Fresh squid rings served with marinara sauce',
          price: 12.99,
          preparationTime: 10,
          dietary: [],
          ingredients: ['squid', 'flour', 'marinara sauce']
        },
        {
          name: 'Bruschetta Trio',
          description: 'Three varieties of toasted bread with toppings',
          price: 9.99,
          preparationTime: 8,
          dietary: ['vegetarian'],
          ingredients: ['bread', 'tomatoes', 'basil', 'mozzarella']
        }
      ],
      'Main Courses': [
        {
          name: 'Grilled Atlantic Salmon',
          description: 'Fresh salmon with lemon herb butter and seasonal vegetables',
          price: 24.99,
          preparationTime: 20,
          dietary: ['gluten-free'],
          ingredients: ['salmon', 'lemon', 'herbs', 'vegetables']
        },
        {
          name: 'Classic Beef Burger',
          description: 'Angus beef patty with lettuce, tomato, and fries',
          price: 16.99,
          preparationTime: 15,
          dietary: [],
          ingredients: ['beef', 'lettuce', 'tomato', 'bun', 'fries']
        }
      ],
      'Desserts': [
        {
          name: 'Chocolate Lava Cake',
          description: 'Warm chocolate cake with molten center and vanilla ice cream',
          price: 8.99,
          preparationTime: 12,
          dietary: ['vegetarian'],
          ingredients: ['chocolate', 'flour', 'eggs', 'vanilla ice cream']
        }
      ],
      'Beverages': [
        {
          name: 'Fresh Orange Juice',
          description: 'Freshly squeezed orange juice',
          price: 4.99,
          preparationTime: 2,
          dietary: ['vegan', 'gluten-free'],
          ingredients: ['oranges']
        }
      ]
    };

    const items = sampleItems[categoryName] || [];
    items.forEach(item => {
      const menuItem: MenuItem = {
        id: generateId(),
        restaurantId,
        categoryId,
        name: item.name!,
        description: item.description!,
        price: item.price!,
        available: true,
        dietary: item.dietary!,
        ingredients: item.ingredients!,
        preparationTime: item.preparationTime!,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.data.menuItems.push(menuItem);
    });
  }

  private createDefaultTables(restaurantId: string) {
    for (let i = 1; i <= 15; i++) {
      const table: Table = {
        id: generateId(),
        restaurantId,
        number: i,
        capacity: i <= 8 ? 2 : i <= 12 ? 4 : 6,
        status: 'available',
        position: {
          x: (i % 5) * 100 + 50,
          y: Math.floor((i - 1) / 5) * 100 + 50
        },
        shape: i % 3 === 0 ? 'round' : 'square',
        createdAt: new Date().toISOString()
      };
      this.data.tables.push(table);
    }
  }

  // User operations
  async findUserByEmail(email: string): Promise<User | null> {
    return this.data.users.find(user => user.email === email) || null;
  }

  async createUser(userData: any, hashedPassword: string): Promise<User> {
    const user: User = {
      id: generateId(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      restaurantId: userData.restaurantId || generateId(),
      permissions: getPermissionsByRole(userData.role),
      phone: userData.phone,
      createdAt: new Date().toISOString()
    };

    // Store password separately (in real app, use proper user table)
    const userWithPassword = { ...user, password: hashedPassword };
    this.data.users.push(user);
    this.saveToStorage();
    return user;
  }

  // Restaurant operations
  async getRestaurant(id: string): Promise<Restaurant | null> {
    return this.data.restaurants.find(r => r.id === id) || null;
  }

  // Menu operations
  async getMenuCategories(restaurantId: string): Promise<MenuCategory[]> {
    return this.data.menuCategories
      .filter(cat => cat.restaurantId === restaurantId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    return this.data.menuItems.filter(item => item.restaurantId === restaurantId);
  }

  async createMenuItem(item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
    const menuItem: MenuItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.menuItems.push(menuItem);
    this.saveToStorage();
    return menuItem;
  }

  // Table operations
  async getTables(restaurantId: string): Promise<Table[]> {
    return this.data.tables.filter(table => table.restaurantId === restaurantId);
  }

  // Order operations
  async getOrders(restaurantId: string): Promise<Order[]> {
    return this.data.orders.filter(order => order.restaurantId === restaurantId);
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.orders.push(newOrder);
    this.saveToStorage();
    return newOrder;
  }

  // Reservation operations
  async getReservations(restaurantId: string): Promise<Reservation[]> {
    return this.data.reservations.filter(res => res.restaurantId === restaurantId);
  }

  async createReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Reservation> {
    const newReservation: Reservation = {
      ...reservation,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.reservations.push(newReservation);
    this.saveToStorage();
    return newReservation;
  }

  // Get user password (for authentication)
  async getUserPassword(email: string): Promise<string | null> {
    // In demo, return a default password hash
    if (email === 'owner@demo.com' || email === 'manager@demo.com') {
      return hashPassword('demo123'); // Default password: demo123
    }
    return null;
  }
}

// Export singleton instance
export const db = new DataStore();