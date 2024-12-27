// Generic Types
export interface Image {
  id: number;
  url: string;
  alt: string;
}

export interface VendorImageResponse extends Image {
  vendor_id: number;
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
  title: string;
  type: string;
  image: Image;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  coordinate: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  resources: {
    vendors: Resource;
    scheduleItems: Resource;
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
