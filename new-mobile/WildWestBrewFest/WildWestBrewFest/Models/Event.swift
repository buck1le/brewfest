//
//  Event.swift
//  WildWestBrewFest
//
//  Created by Josh Loesch on 1/31/25.
//

import Foundation

struct Event: Codable {
    let id: Int
    let name: String
    let description: String
    let thumbnail: String
    private let startDate: String
    private let endDate: String
    let coordinates: Coordinates
    
    private var dateFormatter: ISO8601DateFormatter {
        return ISO8601DateFormatter()
    }
    
    var formattedStartDate: Date? {
        return dateFormatter.date(from: startDate)
    }
    
    var formattedEndDate: Date? {
        return dateFormatter.date(from: endDate)
    }
    
    init(id: Int, name: String, description: String, thumbnail: String, startDate: String, endDate: String) {
        self.id = id
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.startDate = startDate
        self.endDate = endDate
        self.coordinates = .init(latitude: 0, longitude: 0)
    }
}
