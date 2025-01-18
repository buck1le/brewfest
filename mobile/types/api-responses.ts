export const ROOT_RESOURCE = `/events`;

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

  // The type of the vendor being shopping or beer/wine
  type: string;

  operatingOutOf: string;
  thumbnail: string;
  category: string;
  coordinates: {
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
  resources: {
    vendor: Resource;
  }
}


export interface Event {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  startDate: string;
  endDate: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  resources: {
    vendors: Resource;
    brews: Resource;
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
    images: Resource;
  };
}
