type Room = {
  _id: string;
  name: string;
};

type Order = {
  name: string;
  price: number;
  quantity: number;
};

type Table = {
  _id: string;
  name: string;
  roomId: string;
  roomName: string;
  orders: Order[];
  tableOpenTime: string | null;
  tableCloseTime: string | null;
  isOpen: boolean;
  waiter: string | null;
};

const ROOMS: Room[] = [
  { _id: "1", name: "Yaz Bahçesi" },
  { _id: "2", name: "Kış Bahçesi" },
  { _id: "3", name: "Bahar Bahçesi" },
];

const ORDERS: Order[] = [
  { name: "Kahvaltı", price: 250, quantity: 1 },
  { name: "Sıkma Portakal Suyu", price: 50, quantity: 1 },
  { name: "Kahve", price: 70, quantity: 1 },
  { name: "Çay", price: 20, quantity: 1 },
  { name: "Pasta", price: 100, quantity: 1 },
  { name: "Burger", price: 180, quantity: 1 },
  { name: "Pizza", price: 200, quantity: 1 },
];

const WAITERS: string[] = [
  "Ramazan Yetişir",
  "Mehmet Demir",
  "Ayşe Yılmaz",
  "Zeynep Kaya",
  "Fatih Çelik",
];
const TABLE_NAMES: string[] = [
  "Gül",
  "Lale",
  "Menekşe",
  "Papatya",
  "Orkide",
  "Zambak",
  "Karanfil",
  "Sümbül",
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomOrders(): Order[] {
  const numOrders = Math.floor(Math.random() * 5) + 1;
  return Array.from({ length: numOrders }, () => {
    const order = getRandomElement(ORDERS);
    const quantity = Math.floor(Math.random() * 5) + 1;
    return {
      name: order.name,
      price: order.price * quantity,
      quantity: quantity,
    };
  });
}

function generateRoomTables(count: number = 200): Table[] {
  return Array.from({ length: count }, (_, i) => {
    const room = getRandomElement(ROOMS);
    const hasOpenTime = Math.random() > 0.1; // %10 hiç açılmamış masalar olsun
    const tableOpenTime = hasOpenTime
      ? new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString()
      : null;
    const hasCloseTime = hasOpenTime && Math.random() > 0.6;
    const tableCloseTime = hasCloseTime
      ? new Date(
          new Date(tableOpenTime!).getTime() +
            (20 + Math.random() * 100) * 60000
        ).toISOString()
      : null;

    return {
      _id: (i + 1).toString(),
      name: getRandomElement(TABLE_NAMES),
      roomId: room._id,
      roomName: room.name,
      orders: hasOpenTime ? generateRandomOrders() : [],
      tableOpenTime,
      tableCloseTime,
      isOpen: hasOpenTime && !hasCloseTime,
      waiter: hasOpenTime ? getRandomElement(WAITERS) : null,
    };
  });
}

export const ROOM_TABLES: Table[] = generateRoomTables();
