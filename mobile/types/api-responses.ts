// Generic Types
export interface Image {
  url: string;
  alt: string;
}

export interface Resource {
  href: string;
  auth: string | null;
}

// Entities
export interface Vendor {
  id: number;
  title: string;
  description: string;
  image: Image;
  category: string;
  location: {
    latitude: number;
    longitude: number;
  };
  resources: {
    images: Image[];
    inventory: Resource;
  };
}

export interface InventoryItem {
  id: number;
  title: string;
  image: Image;
  category: string;
  description: string;
}

export interface Event {
  name: string;
  description: string;
  image: Image[];
  resources: {
    vendors: Resource;
    schedule: Resource;
  };
}

export interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  eventId: number;
  image: Image;
  resources: {
    images: Image[];
  };
}
