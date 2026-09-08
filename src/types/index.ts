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
