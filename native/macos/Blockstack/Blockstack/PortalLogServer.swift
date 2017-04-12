//
//  PortalLogServer.swift
//  Blockstack
//
//  Created by Larry Salibra on 4/9/17.
//  Copyright © 2017 Blockstack. All rights reserved.
//

import os.log
import Foundation
import Swifter

class PortalLogServer {
    
    enum LogEventDecoderError: Error {
        case noRootObjectFound
        case noMessageFound
        case noCategoryFound
        case noLevelFound
    }
    
    enum AuthorizationError: Error {
        case noHeader
        case invalidHeader
    }
    
    let server = HttpServer()
    
    let log = OSLog(subsystem: Bundle.main.bundleIdentifier!, category: "PortalLogServer")
    let portalLogSubsystem = "org.blockstack.portal"
    
    
    
    init(port: UInt16, password: String) {
        initRoutes(server: server, password: password)
        do {
            server.listenAddressIPv4 = "127.0.0.1"
            try server.start(port, forceIPv4: true)
            NSLog("Server started: Operating: \(server.operating)")
            try NSLog("Listening: \(server.listenAddressIPv4!) Port: \(server.port())")
            
        } catch {
            NSLog("Server failed to start.")
        }
    }
    
    deinit {
        server.stop()
    }
    
    private func initRoutes(server: HttpServer, password: String) {
        os_log("initRoutes", log: log, type: .debug)
        
        let corsHeaders = ["Access-Control-Allow-Origin":"*",
                           "Access-Control-Allow-Methods":"GET, POST, OPTIONS",
                           "Access-Control-Allow-Headers": "Authorization, Content-Type" ]
        
        server["/"] = { request in
            
            switch request.method {
                
            case "POST":
                os_log("POST /", log: self.log, type: .debug)
                let logEvent = Data(bytes: request.body)
                
                do {
                    os_log("Trying to authenticate log event request", log: self.log, type: .debug)
                    try self.authenticatePortal(request: request, password: password)
                    os_log("Log request authenticated", log: self.log, type: .debug)
                } catch {
                    os_log("Authorization failed", log: self.log, type: .error)
                    return HttpResponse.forbidden
                }
                
                do {
                    try self.processPortalLogEvent(logEvent:logEvent)
                } catch {
                    os_log("Error trying to process portal log: %{public}@", log: self.log, type: .error, error.localizedDescription)
                    return HttpResponse.raw(400, "Error trying to process portal log", corsHeaders, {
                        try $0.write([UInt8]("Error trying to process portal log".utf8))
                    })
                }
                
                return HttpResponse.raw(200, "OK", corsHeaders, { try $0.write([UInt8]("OK".utf8)) })
                
            case "OPTIONS": // CORS pre-flight
                os_log("OPTIONS /", log: self.log, type: .debug)
                return HttpResponse.raw(200, "OK", corsHeaders, { try $0.write([UInt8]("OK".utf8)) })
                
            default:
                return HttpResponse.notFound
                
            }
        }
    }
    
    private func authenticatePortal(request: HttpRequest, password: String) throws {
        guard let authorizationHeader = request.headers["authorization"]
            else {
                os_log("No authorization header", log: log, type: .error)
                throw AuthorizationError.noHeader
        }
        
        if(authorizationHeader == "basic \(password)") {
            os_log("Authorization succeeded", log: log, type: .debug)
        } else {
            os_log("Invalid authorization header", log: log, type: .error)
            throw AuthorizationError.invalidHeader
        }
    }
    
    private func processPortalLogEvent(logEvent:Data) throws {
        let logEventJson = try JSONSerialization.jsonObject(with: logEvent, options: [])
        guard let dictionary = logEventJson as? [String: Any]
            else {
                throw LogEventDecoderError.noRootObjectFound
        }
        
        guard let category = dictionary["category"] as? String
            else {
                throw LogEventDecoderError.noCategoryFound
        }
        
        guard let level = dictionary["level"] as? String
            else {
                throw LogEventDecoderError.noLevelFound
        }
        
        guard let message = dictionary["message"] as? String
            else {
                throw LogEventDecoderError.noMessageFound
        }
        
        let portalLog = OSLog(subsystem: portalLogSubsystem, category: category)
        
        switch level {
        case "TRACE", "DEBUG": // Map to macOS's Debug level
            os_log("%{public}@", log: portalLog, type: .debug, message)
            
        case "INFO": // Map to macOS's Info level
            os_log("%{public}@", log: portalLog, type: .info, message)
            
        case "WARN": // Map to macOS's Default level
            os_log("%{public}@", log: portalLog, type: .default, message)
            
        case "ERROR", "FATAL": // Map both to macOS's Error level (macOS's Fault level indicates system problem)
            os_log("%{public}@", log: portalLog, type: .error, message)
            
        default:  // Map MARK, OFF, ALL and any other level to macOS's Default level
            os_log("%{public}@", log: portalLog, type: .default, message)
            
        }
    }
    
}

