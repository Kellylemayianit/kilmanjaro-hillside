// Starting data. price:null = "Ask for price", stock:null = "not tracked". Admin can edit both.
const i = (id, type, cat, name, img) => ({ id, type, cat, name, img, price: null, stock: null });
export const SEED = {
  items: [
    i('f1', 'food', 'Nyama choma', 'Nyama choma', '1.jpg'),
    i('f2', 'food', 'Nyama choma', 'Oven-roasted meat', '5.jpg'),
    i('f3', 'food', 'Plates', 'Beef with ugali & sukuma', '3.jpg'),
    i('f4', 'food', 'Plates', 'Chips & beef plate', '4.jpg'),
    i('f5', 'food', 'Fish', 'Fried tilapia with ugali', '19.jpg'),
    i('d1', 'drink', 'Spirits & liqueurs', 'Amarula Cream', '6.jpg'),
    i('d2', 'drink', 'Spirits & liqueurs', 'Jameson', '6.jpg'),
    i('d3', 'drink', 'Spirits & liqueurs', "Hunter's Choice", '6.jpg'),
    i('d4', 'drink', 'Spirits & liqueurs', 'Viceroy Brandy', '6.jpg'),
    i('d5', 'drink', 'Beer & soft drinks', 'Tusker', '7.jpg'),
    i('d6', 'drink', 'Beer & soft drinks', 'White Cap', '7.jpg'),
  ],
  rooms: [
    { id: 'r1', name: 'Double room', img: '16.jpg', price: null, desc: 'Wooden bed, bright walls, quiet garden setting.' },
    { id: 'r2', name: 'Comfort double', img: '20.jpg', price: null, desc: 'Carved headboard with a lace canopy.' },
  ],
  bookings: [],
};
