//
//  ScheduleItem.swift
//  WildWestBrewFest
//
//  Created by Josh Loesch on 1/31/25.
//

import Foundation

struct ScheduleItemResources {
    let images: APIResource
}

struct ScheduleItem {
    let id: Int
    let title: String
    let description: String
    let startDate: String
    let endDate: String
    let createdAt: Date?
    let updatedAt: Date?
    let eventId: Int
    let thumbnail: String
    let resources: ScheduleItemResources
}
