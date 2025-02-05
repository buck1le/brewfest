//
//  ApiService.swift
//  WildWestBrewFest
//
//  Created by Josh Loesch on 1/30/25.
//

import Foundation

enum DataState<T> {
    case loading
    case loaded(T)
    case error(Error)
    case empty
}

// MARK: - Protocol for testability and abstraction
protocol APIServiceProtocol {
    func fetch<T: Decodable>(_ href: String) async throws -> T
}

// MARK: - Error handling from API
enum APIError: Error {
    case invalidURL
    case invalidResponse
    case requestFailed(Error)
    case decodingFailed(Error)
    case statusCode(Int)
}

// MARK: - Main Service Implementation
public final class APIService: APIServiceProtocol {
    
    public static let shared = APIService()
    
    private let session: URLSession
    private let decoder: JSONDecoder
    
    // Allow dependency injecting for testing
    init(session: URLSession = .shared, decoder: JSONDecoder = JSONDecoder()) {
        self.session = session
        self.decoder = decoder
        decoder.dateDecodingStrategy = .iso8601
    }
    
    public func fetch<T>(_ href: String) async throws -> T where T : Decodable {
        guard let url = URL(string: href) else {
            throw APIError.invalidURL
        }
        
        do {
            let (data, response) = try await session.data(from: url)
            
            print("Fetched data: \(String(data: data, encoding: .utf8) ?? "(unprintable)")")
            
            guard let httpResponse = response as? HTTPURLResponse else {
                throw APIError.invalidResponse
            }
            guard 200...299 ~= httpResponse.statusCode else {
                throw APIError.statusCode(httpResponse.statusCode)
            }
            
            do {
                return try decoder.decode(T.self, from: data)
            } catch {
                print("Decoding failed: \(error)")
                throw APIError.decodingFailed(error)
            }
        } catch let error as APIError {
           throw error
        } catch {
            throw APIError.requestFailed(error)
        }
    }
}
