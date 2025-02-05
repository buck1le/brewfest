//
//  InventoryItem.swift
//  WildWestBrewFest
//
//  Created by Josh Loesch on 1/31/25.
//

import Foundation


struct InventoryItemResources {
    let vendor: APIResource
}


struct InventoryItem {
    let id: Int
    let name: String
    let category: String
    let thumbnail: String
    let resources: InventoryItemResources
}
