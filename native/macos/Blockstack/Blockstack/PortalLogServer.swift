//
//  PortalLogServer.swift
//  Blockstack
//
//  Created by Larry Salibra on 4/9/17.
//  Copyright © 2017 Blockstack. All rights reserved.
//

import os.log
import Swifter

class PortalLogServer {
    
    let server = HttpServer()
    
    let log = OSLog(subsystem: Bundle.main.bundleIdentifier!, category: "PortalLogServer")
    let portal_log = OSLog(subsystem: Bundle.main.bundleIdentifier!, category: "Portal")
    
    init(port: UInt16) {
        initRoutes(server: server)
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
    
    private func initRoutes(server: HttpServer) {
        os_log("initRoutes", log: log, type: .debug)
        server.POST["/log"] = { request in
            guard let logMessage = String(bytes: request.body, encoding: .utf8) else {
                let errorMessage : StaticString = "Unable to decode portal log entry"
                os_log(errorMessage, log: self.log, type: .error)
                return HttpResponse.badRequest(.text(String(describing: errorMessage)))
            }
            os_log("%{public}@", log: self.portal_log, type: .default, logMessage)
            return HttpResponse.ok(.text("OK"))
        }
    }
    
    
}

