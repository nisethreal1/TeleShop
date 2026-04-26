import { Phone } from '../types';

export const mockPhones: Phone[] = [
  {
    id: 'p1',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system.',
    shortDescription: 'Titanium. A17 Pro. 5x Telephoto.',
    price: 1199,
    images: [
      'https://images.unsplash.com/photo-1591337676887-a4b7f05e2e8b?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=1000',
    ],
    features: ['A17 Pro chip', '6.7" Super Retina XDR', '48MP Main Camera', '5x Optical Zoom', 'Titanium design'],
    rating: 4.9,
    reviewsCount: 1240,
    condition: 'New',
    badges: ['Best Seller', 'New Arrival'],
    variants: [
      { id: 'v1a', color: 'Natural Titanium', colorHex: '#B5AE9E', storage: '256GB', price: 1199, stock: 15 },
      { id: 'v1b', color: 'Black Titanium', colorHex: '#42413E', storage: '512GB', price: 1399, stock: 8 },
    ],
    reviews: [
      { id: 'r1', userId: 'u1', userName: 'Alex M.', rating: 5, comment: 'Best iPhone ever. Battery life is amazing.', date: '2023-10-12' }
    ]
  },
  {
    id: 'p3',
    brand: 'Google',
    model: 'Pixel 8 Pro',
    description: 'The pro-level Pixel. Engineered by Google. Fully upgraded cameras and a first-of-its-kind thermometer. Plus, Google AI.',
    shortDescription: 'Magic made by Google.',
    price: 899,
    originalPrice: 999,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351cb31b?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1546054454-e6741c96a323?auto=format&fit=crop&q=80&w=1000',
    ],
    features: ['Google Tensor G3', '6.7" Super Actua display', 'Pro-level triple rear camera', 'Magic Editor'],
    rating: 4.7,
    reviewsCount: 654,
    condition: 'New',
    badges: ['Top Rated'],
    variants: [
      { id: 'v3a', color: 'Bay', colorHex: '#84B1D4', storage: '128GB', price: 899, stock: 12 },
      { id: 'v3b', color: 'Obsidian', colorHex: '#202124', storage: '256GB', price: 959, stock: 18 },
    ],
    reviews: []
  },
  {
    id: 'p4',
    brand: 'Apple',
    model: 'iPhone 13 Pro',
    description: 'A dramatically more powerful camera system. A display so responsive, every interaction feels new again. Refurbished in pristine condition.',
    shortDescription: 'Oh. So. Pro.',
    price: 599,
    images: [
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&q=80&w=1000',
    ],
    features: ['A15 Bionic chip', '6.1" Super Retina XDR with ProMotion', 'Pro camera system'],
    rating: 4.6,
    reviewsCount: 320,
    condition: 'Like New',
    badges: ['Great Value', 'Refurbished'],
    variants: [
      { id: 'v4a', color: 'Sierra Blue', colorHex: '#9BB5CE', storage: '128GB', price: 599, stock: 4 },
    ],
    reviews: []
  },
  {
    id: 'p5',
    brand: 'Nothing',
    model: 'Phone (2)',
    description: 'Come to the bright side. A new Glyph Interface. Improved 50 MP dual camera. And Nothing OS 2.0.',
    shortDescription: 'A new era of design.',
    price: 599,
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=1000',
    ],
    features: ['Snapdragon 8+ Gen 1', '6.7" LTPO AMOLED', 'Glyph Interface', 'Nothing OS 2.0'],
    rating: 4.5,
    reviewsCount: 156,
    condition: 'New',
    variants: [
      { id: 'v5a', color: 'Dark Gray', colorHex: '#303030', storage: '256GB', price: 599, stock: 8 },
      { id: 'v5b', color: 'White', colorHex: '#F0F0F0', storage: '256GB', price: 599, stock: 3 },
    ],
    reviews: []
  }
];
