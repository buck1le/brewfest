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
  operatingOutOf: string;
  image: Image;
  category: string;
  coordinate: {
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
  type: string;
  image: Image;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  thumbnail: Image;
  coordinate: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  resources: {
    vendors: Resource;
    scheduleItems: Resource;
    image: Image[];
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
