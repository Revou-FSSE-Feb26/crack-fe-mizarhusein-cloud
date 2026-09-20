export interface MenuCategoryMeta {
  slug: string;
  label: string;
}

export interface MenuItemOption {
  id: string;
  label: string;
  priceDelta: number;
}

export interface MenuItemOptionGroup {
  id: string;
  label: string;
  type: "single" | "multiple";
  required?: boolean;
  options: MenuItemOption[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  optionGroups?: MenuItemOptionGroup[];
}

export interface CartLine {
  lineId: string;
  item: MenuItem;
  quantity: number;
  notes: string;
  selectedOptions?: { groupId: string; optionIds: string[] }[];
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  description: string;
  descriptionEn: string;
  location: string;
  phone: string;
  email: string;
  hours: string;
}

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type FormStatus = "idle" | "loading" | "success" | "error";

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Reservation {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  status: ReservationStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "ADMIN" | "CUSTOMER";

// An account as listed on the admin Users page (never includes the password).
export interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Who is logged in, as returned by /api/auth/me.
export interface SessionUser {
  userId: number;
  email: string;
  name: string | null;
  role: UserRole;
}

export type OrderStatus = "PENDING" | "PREPARING" | "SERVED" | "COMPLETED" | "CANCELLED";

export interface OrderItem {
  id: number;
  menuId: number | null;
  name: string;
  price: number;
  quantity: number;
  notes: string | null;
}

export interface Order {
  id: number;
  customerName: string | null;
  tableNumber: string | null;
  notes: string | null;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Response of GET /api/admin/stats (the admin dashboard).
export interface DashboardStats {
  generatedAt: string;
  todayReservations: number;
  todayGuests: number;
  upcomingReservations: number;
  pendingReservations: number;
  totalMenuItems: number;
  ordersToday: number;
  revenueToday: number;
  activeOrders: number;
  recentReservations: Reservation[];
  recentOrders: Order[];
}

// One entry of the admin notification bell (GET /api/admin/notifications).
export type NotificationItem =
  | {
      type: "reservation";
      id: number;
      createdAt: string;
      isNew: boolean;
      customerName: string;
      partySize: number;
      date: string;
    }
  | {
      type: "order";
      id: number;
      createdAt: string;
      isNew: boolean;
      customerName: string | null;
      tableNumber: string | null;
      total: number;
      itemCount: number;
    };

export interface NotificationFeed {
  unreadCount: number;
  seenAt: string;
  items: NotificationItem[];
}
