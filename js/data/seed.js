// Starting data. price:null = "Ask for price", stock:null = "not tracked". Admin can edit both.
const i = (id, type, cat, name, img) => ({ id, type, cat, name, img, price: null, stock: null });
export const SEED = {
  items: [
    i('f1', 'food', 'Nyama choma', 'Nyama choma', 'real-grill-1.jpg'),
    i('f2', 'food', 'Nyama choma', 'Oven-roasted meat', 'real-oven-meat.jpg'),
    i('f3', 'food', 'Plates', 'Beef with ugali & sukuma', 'real-plate-1.jpg'),
    i('f4', 'food', 'Plates', 'Chips & beef plate', 'real-plate-2.jpg'),
    i('f5', 'food', 'Fish', 'Fried tilapia with ugali', 'real-fish.jpg'),
    i('d1', 'drink', 'Spirits & liqueurs', 'Amarula Cream', 'real-spirits.jpg'),
    i('d2', 'drink', 'Spirits & liqueurs', 'Jameson', 'real-spirits.jpg'),
    i('d3', 'drink', 'Spirits & liqueurs', "Hunter's Choice", 'real-spirits.jpg'),
    i('d4', 'drink', 'Spirits & liqueurs', 'Viceroy Brandy', 'real-spirits.jpg'),
    i('d5', 'drink', 'Beer & soft drinks', 'Tusker', 'real-bar.jpg'),
    i('d6', 'drink', 'Beer & soft drinks', 'White Cap', 'real-bar.jpg'),
  ],
  rooms: [
    { id: 'r1', name: 'Double room', tag: 'Wooden bed, bright walls', img: 'real-room-double.jpg', price: null, desc: 'A wooden bed frame in a brightly painted room with a quiet garden setting. Simple and comfortable.' },
    { id: 'r2', name: 'Comfort double', tag: 'Carved headboard, lace canopy', img: 'real-room-comfort.jpg', price: null, desc: 'A roomier double with a carved wooden headboard and a lace canopy overhead. A little more detail for a longer stay.' },
  ],
  bookings: [],
  prefs: { contact: 'whatsapp', intent: null },
};
