//
//  Vendor.swift
//  WildWestBrewFest
//
//  Created by Josh Loesch on 1/31/25.
//

import Foundation

struct VendorResources {
    let images: APIResource
    let inventory: APIResource
}

struct Vendor {
    let id: Int
    let name: String
    let description: String
    let type: String
    let operatingOutOuf: String
    let thumbnail: String
    let category: String
    let corrdinates: Coordinates
    let resources: VendorResources
}
