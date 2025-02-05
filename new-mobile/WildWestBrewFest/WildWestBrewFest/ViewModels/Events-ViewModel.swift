//
//  Events-ViewModel.swift
//  WildWestBrewFest
//
//  Created by Josh Loesch on 1/30/25.
//


import Foundation

extension Events {
    @Observable
    class ViewModel {
        private(set) var state: DataState<[Event]> = .loading
        private let apiService: APIServiceProtocol
        
        init(apiService: APIServiceProtocol = APIService.shared) {
            self.apiService = apiService
        }
        
        func fetchEvents(href: String) async {
            state = .loading
            
            do {
                let events: [Event] = try await apiService.fetch(href)
                await MainActor.run {
                    state = events.isEmpty ? .empty : .loaded(events)
                }
            } catch {
                await MainActor.run {
                    state = .error(error)
                }
            }
        }
    }
}
