import type { MenuItem, KitchenStation } from '../types';

const API_URL = 'http://localhost:8080/api/menu-items';

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to load menu: ${response.status}`);
  }

  const data = await response.json();

  return data.map((item: any) => ({
    ...item,
    category: item.categoryId,
    dietaryTags: [],
    availableAddOns: [],
    customizationOptions: {
      chutneys: [],
      spiceLevels: [],
    },
    variants: [],
  }));
}
export async function fetchCategories() {
  const response = await fetch('http://localhost:8080/api/categories');

  if (!response.ok) {
    throw new Error(`Failed to load categories: ${response.status}`);
  }

  const data = await response.json();

  return data.map((category: any) => ({
    id: category.id,
    name: category.name,
    iconName: category.slug,
    description: category.description || '',
    imageUrl: category.imageUrl || '',
    itemCount: 0,
  }));
}
export async function fetchKitchenStations(): Promise<KitchenStation[]> {
  const response = await fetch('http://localhost:8080/api/kitchen-stations');

  if (!response.ok) {
    throw new Error(`Failed to load kitchen stations: ${response.status}`);
  }

  const data = await response.json();

  return data.map((station: any) => ({
    ...station,
    currentWorkloadPercent: 0,
    inQueueCount: 0,
  }));
}
export async function fetchOrders() {
  const response = await fetch('http://localhost:8080/api/orders');

  if (!response.ok) {
    throw new Error(`Failed to load orders: ${response.status}`);
  }

  return await response.json();
}
export async function createOrder(order: any) {
  const response = await fetch('http://localhost:8080/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to save order');
  }

  return await response.json();
}
export async function createMenuItem(item: any) {
  const { category, dietaryTags, ...rest } = item;

  const response = await fetch('http://localhost:8080/api/menu-items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...rest,
      categoryId: item.categoryId ?? category,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to save menu item');
  }

  return await response.json();
}