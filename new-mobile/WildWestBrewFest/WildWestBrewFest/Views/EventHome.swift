//
//  EventHome.swift
//  WildWestBrewFest
//
//  Created by Josh Loesch on 2/5/25.
//

import SwiftUI

struct EventHome: View {
    var event: Event
    
    var body: some View {
        TabView {
           Text("Event Home")
                .tabItem {
                   Label("Event Home", systemImage: "house")
                }
        }
    }
}

#Preview(traits: .modifier(EventHomeMockDataTrait())) {
    @Previewable @Environment(\.previewEvent) var event: Event
    
    EventHome(event: event)
}
