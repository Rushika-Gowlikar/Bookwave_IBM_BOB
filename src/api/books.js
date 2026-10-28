import { getEstimatedDeliveryDate, getEstimatedTentative } from '../data/books';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// [cover colour, accent colour] pairs, picked per category
const PALETTE = [
  ['#f59e0b', '#d97706'],
  ['#ef4444', '#b91c1c'],
  ['#0284c7', '#0369a1'],
  ['#9333ea', '#7e22ce'],
  ['#0f766e', '#115e59'],
  ['#f97316', '#c2410c'],
  ['#1d4ed8', '#1e3a8a'],
  ['#b45309', '#78350f'],
];

function colorsFor(category) {
  let hash = 0;
  for (const ch of category) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

// The API returns { id, title, author, price, category, stock, cover, description }.
// The UI expects more fields (rating, brand, delivery dates, ...), so fill the gaps.
function toUiBook(apiBook, all) {
  const id = Number(apiBook.id);
  const maxId = Math.max(...all.map(b => Number(b.id)));
  const [coverColor, coverAccent] = colorsFor(apiBook.category);
  const stock = Number(apiBook.stock);

  return {
    id,
    title: apiBook.title,
    author: apiBook.author,
    price: apiBook.price,
    originalPrice: apiBook.price,
    category: apiBook.category,
    description: apiBook.description,
    cover: apiBook.cover,
    stock,
    // not provided by the API - simple defaults
    authorBio: '',
    brand: 'BookWave',
    format: 'Paperback',
    language: 'English',
    rating: apiBook.rating ?? 0,
    ratingCount: apiBook.ratingCount ?? 0,
    soldCount: '',
    reviews: apiBook.reviews ?? [],
    coverColor,
    coverAccent,
    deliveryDate: getEstimatedDeliveryDate(4),
    tentativeDelivery: getEstimatedTentative(3, 5),
    // derived from real API data
    isBestseller: stock <= 4, // low stock = selling fast
    isNew: id > maxId - 4, // newest ids
    featured: id <= 5,
    tag: stock <= 4 ? 'Bestseller' : id > maxId - 4 ? 'New Launch' : id <= 5 ? 'Recommended' : '',
    relatedIds: all
      .filter(b => b.category === apiBook.category && Number(b.id) !== id)
      .slice(0, 3)
      .map(b => Number(b.id)),
  };
}

export async function fetchBooks() {
  const res = await fetch(`${API_URL}/api/books`);
  if (!res.ok) throw new Error(`API responded with ${res.status}`);
  const data = await res.json();
  return data.map(b => toUiBook(b, data));
}
