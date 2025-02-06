//
//  Events.swift
//  WildWestBrewFest
//
//  Created by Josh Loesch on 1/30/25.
//

import SwiftUI

struct Events: View {
    @State private var viewModel = ViewModel()
    
    var body: some View {
        ZStack {
            Color.orange
                .ignoresSafeArea()
            
            switch viewModel.state {
            case .loading:
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle())
                
            case .loaded(let events):
                GeometryReader { geometry in
                    // Use a VStack that divides the vertical space.
                    VStack(spacing: 16) {
                        ForEach(events, id: \.id) { event in
                            AsyncImage(url: URL(string: APIConstants.baseImageURL + event.thumbnail)) { phase in
                                switch phase {
                                case .empty:
                                    ProgressView()
                                        .frame(maxWidth: .infinity)
                                        .frame(height: geometry.size.height * 0.45)
                                        .background(Color.white.opacity(0.1))
                                        .redacted(reason: .placeholder)
                                case .success(let image):
                                    VStack(spacing: 0) {
                                        NavigationLink(destination: EventHome(event: event)) {
                                            image
                                                .resizable()
                                                .aspectRatio(contentMode: .fit)
                                                .frame(maxWidth: .infinity)
                                                .frame(height: geometry.size.height * 0.45)
                                                .clipped()
                                        }
                                    }
                                    .shadow(radius: 4)
                                case .failure:
                                    EmptyView()
                                @unknown default:
                                    EmptyView()
                                }
                            }
                        }
                    }
                    .frame(width: geometry.size.width, height: geometry.size.height)
                }
                
            case .empty:
                Text("No events available")
                    .foregroundColor(.white)
                
            case .error(let error):
                VStack {
                    Text("Error: \(error.localizedDescription)")
                    Button("Retry") {
                        Task {
                            await viewModel.fetchEvents(href: "\(APIConstants.baseURL)/events")
                        }
                    }
                }
            }
        }
        .task {
            if case .loaded(let events) = viewModel.state, !events.isEmpty {
                return
            } else {
                await viewModel.fetchEvents(href: "\(APIConstants.baseURL)/events")
            }
        }
    }
}

#Preview {
    Events()
}
