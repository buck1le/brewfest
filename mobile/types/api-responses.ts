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
  title: string;
  description: string;
  image: Image[];
  category: string;
}

export interface Event {
  name: string;
  description: string;
  image: Image[];
}

// Base Resource Types
type BaseIndexResource<T extends string> = {
  [K in T]: Resource;
}

// Entity-specific Resource Types
type VendorResources = {
  show: {
    images: Image[];
  };
  index: BaseIndexResource<'vendor'>;
}

type EventResources = {
  show: {
    vendors: Resource;
  };
  index: BaseIndexResource<'event'>;
}

// Generic Resource Container
export type WithResources<TEntity, TResource> = TEntity & {
  resources: TResource;
}

// Entity-specific Types
export type ShowVendor = WithResources<Vendor, VendorResources['show']>;
export type ShowEvent = WithResources<Event, EventResources['show']>;

// Array Types
export type IndexVendors = Array<WithResources<Vendor, BaseIndexResource<'vendor'>>>;
export type IndexEvents = Array<WithResources<Event, BaseIndexResource<'event'>>>;
