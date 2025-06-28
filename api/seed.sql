-- Insert test accounts
INSERT INTO accounts (name, description) VALUES
('Admin Account', 'Main administrator account'),
('Event Manager', 'Event management staff account'),
('Vendor Manager', 'Vendor management staff account');

-- Insert test events
INSERT INTO events (name, description, start_date, end_date, thumbnail, latitude, longitude) VALUES
('Katy Wild West Brew Fest', 'Annual summer celebration of craft beers', '2025-06-15', '2025-06-17', null, 44.9778, -93.2650),
('Pflugerville Wild West Brew Fest', 'Cozy winter beer tasting event', '2025-12-10', '2025-12-12', null, 44.9537, -93.0900);

-- Insert test vendors
INSERT INTO vendors (name, email, phone, created_at, updated_at, event_id, latitude, longitude, category, thumbnail, operating_out_of, description, vendor_type) VALUES
('Hoppy Brewery', 'contact@hoppybrewery.com', '555-0101', NOW(), NOW(), 1, 44.9778, -93.2650, 'Brewery', null, 'Food Truck', 'Craft IPA specialist', 'Beer'),
('Malt Masters', 'info@maltmasters.com', '555-0102', NOW(), NOW(), 1, 44.9780, -93.2655, 'Brewery', null, 'Tent', 'Traditional German-style beers', 'Beer'),
('Food Truck Delights', 'food@truckdelights.com', '555-0103', NOW(), NOW(), 1, 44.9775, -93.2648, 'Food', null, 'Food Truck', 'Gourmet street food', 'Food');

-- Insert test vendor inventory items
INSERT INTO vendor_inventory_items (name, category, vendor_id, thumbnail, event_id) VALUES
('Hoppy IPA', 'Beer', 1, null, 1),
('Double IPA', 'Beer', 1, null, 1),
('German Pilsner', 'Beer', 2, null, 1),
('Bratwurst Plate', 'Food', 3, null, 1);

-- Insert test schedule items
INSERT INTO schedule_items (title, description, start_date, end_date, created_at, updated_at, event_id, thumbnail) VALUES
('Opening Ceremony', 'Festival kick-off celebration', '2025-06-15 12:00:00', '2025-06-15 13:00:00', NOW(), NOW(), 1, null),
('Beer Tasting Workshop', 'Learn about different beer styles', '2025-06-15 14:00:00', '2025-06-15 16:00:00', NOW(), NOW(), 1, null),
('Live Music - Local Band', 'Entertainment at the main stage', '2025-06-15 18:00:00', '2025-06-15 20:00:00', NOW(), NOW(), 1, null);

