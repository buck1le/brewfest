// Generic Types
export interface Image {
  id: number;
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
  name: string;
  description: string;
  operatingOutOf: string;
  thumbnail: string;
  category: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  resources: {
    images: Resource;
    inventory: Resource;
  };
}

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  thumbnail: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  coordinate: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  resources: {
    vendors: Resource;
    schedule: Resource;
  };
}

export interface ScheduleItem {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  eventId: number;
  thumbnail: string;
  resources: {
    images: Image[];
  };
}
