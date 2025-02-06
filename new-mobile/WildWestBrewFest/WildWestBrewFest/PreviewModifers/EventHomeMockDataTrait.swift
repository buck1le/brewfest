//
//  EventHomeMockDataTrait.swift
//  WildWestBrewFest
//
//  Created by Josh Loesch on 2/5/25.
//

import SwiftUI

private var mockEvent: Event = Event(id: 1, name: "something awesome", description: "best event ever", thumbnail: "some_thumbnail", startDate: "2025-02-05", endDate: "2025-02-06")

// First, define an environment key if your view expects to read the event from the Environment:
private struct PreviewEventKey: EnvironmentKey {
    static let defaultValue: Event = mockEvent
}

extension EnvironmentValues {
    var previewEvent: Event {
        get { self[PreviewEventKey.self] }
        set { self[PreviewEventKey.self] = newValue }
    }
}

struct EventHomeMockDataTrait: PreviewModifier {
    // This async static method is called once for all previews using this modifier.
    static func makeSharedContext() async throws -> Event {
        let apiClient = APIService.shared
        do {
            let event: Event = try await apiClient.fetch("\(APIConstants.baseURL)/events/1")
            print("Fetched event: \(event)")
            
            return event
        } catch {
            print("Error fetching event: \(error)")
            return mockEvent
        }
    }
    
    func body(content: Content, context: Event) -> some View {
        content
            .environment(\.previewEvent, context)
    }
}
