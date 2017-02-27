//
//  AppDelegate.swift
//  Blockstack
//
//  Created by Larry Salibra on 2/26/17.
//  Copyright © 2017 Blockstack. All rights reserved.
//

import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
    
    
    let productionModePortalPort = 8888
    let developmentModePortalPort = 3000
    let corsProxyPort = 1337
    let coreProxyPort = 6270
    let portalAuthenticationPath = "/auth?authRequest="
    
    var statusItem : NSStatusItem = NSStatusItem()
    
    var isDevModeEnabled : Bool = false
    
    var isShutdown : Bool = false
    
    let portalProxyProcess = Process()
    let corsProxyProcess = Process()

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        NSLog("applicationDidFinishLaunching")
        
        let appleEventManager = NSAppleEventManager.shared()
        appleEventManager.setEventHandler(self, andSelector: #selector(handleGetURLEvent), forEventClass: UInt32(kInternetEventClass), andEventID: UInt32(kAEGetURL))
        
        statusItem = NSStatusBar.system().statusItem(withLength: NSSquareStatusItemLength)
        
        if let button = statusItem.button {
            button.image = NSImage(named: "MenuBar")
            button.alternateImage = NSImage(named: "MenuBarDark")
            button.action = #selector(statusItemClick)
        }
        
        startPortalProxy()
        startCorsProxy()
        
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        shutdown(terminate: false)
    }
    
    func handleGetURLEvent(_ event: NSAppleEventDescriptor, replyEvent: NSAppleEventDescriptor) {
        let url = URL(string: (event.paramDescriptor(forKeyword: keyDirectObject)?.stringValue) ?? "")
        
        NSLog("Blockstack URL: \(url)")
        NSLog("Blockstack URL: \(url?.host)")
        
        if let value = url?.host {
            openPortal(path: "\(portalAuthenticationPath)\(value)")
        }
    }

    func portalBaseUrl() -> String {
        return "http://localhost:\(portalPort())"
    }
    
    func portalPort() -> Int {
        return isDevModeEnabled ? developmentModePortalPort : productionModePortalPort
    }
    
    func openPortalClick(sender: AnyObject?) {
        NSLog("openPortalClick")
        openPortal(path: "/")
    }
    
    func openPortal(path: String) {
        let portalURLString = "\(portalBaseUrl())\(path)"
        NSLog("Opening portal with String: \(portalURLString)")
        let portalURL = URL(string: portalURLString )
        NSLog("Opening portal with URL: \(portalURL)")
        NSWorkspace.shared().open(portalURL!)
    }
    
    func statusItemClick(sender: AnyObject?) {
        NSLog("statusItemClick")
        
        let menu = NSMenu()
        
        var showExpandedMenu = false
        
        if(NSApp.currentEvent?.modifierFlags.contains(NSEventModifierFlags.option) ?? false) {
            NSLog("Option click")
            showExpandedMenu = true
        }
        
        var goToPortalTitle = "Go to Portal"
        
        if isDevModeEnabled {
            goToPortalTitle = "Go to Development Portal"
            showExpandedMenu = true
        }
        
        menu.addItem(withTitle: goToPortalTitle, action: #selector(openPortalClick), keyEquivalent: "g")
        menu.addItem(NSMenuItem.separator())
        
        if showExpandedMenu {
            
            let portalPortMenuItem = NSMenuItem()
            portalPortMenuItem.title = "Portal proxy running on port \(portalPort())"
            portalPortMenuItem.isEnabled = false
            menu.addItem(portalPortMenuItem)
            
            let corsProxyPortMenuItem = NSMenuItem()
            corsProxyPortMenuItem.title = "CORS proxy running on port \(corsProxyPort)"
            corsProxyPortMenuItem.isEnabled = false
            menu.addItem(corsProxyPortMenuItem)
            
            let corePortMenuItem = NSMenuItem()
            corePortMenuItem.title = "Core node running on port \(corsProxyPort)"
            corePortMenuItem.isEnabled = false
            menu.addItem(corePortMenuItem)
            
            menu.addItem(NSMenuItem.separator())
            
            let devModeStatusMenuItem = NSMenuItem()
            devModeStatusMenuItem.title = "Portal Development Mode: \(isDevModeEnabled ? "Enabled" : "Disabled")"
            devModeStatusMenuItem.isEnabled = false
            menu.addItem(devModeStatusMenuItem)
            
            menu.addItem(withTitle: "\(isDevModeEnabled ? "Disable" : "Enable") Portal Development Mode", action: #selector(devModeClick), keyEquivalent: "d")
            
            menu.addItem(NSMenuItem.separator())

        }
        
        menu.addItem(withTitle: "Turn off Blockstack", action: #selector(exitClick), keyEquivalent: "q")
        
        statusItem.popUpMenu(menu)
    }
    
    func devModeClick(sender: AnyObject?) {
        NSLog("devModeClick")
        isDevModeEnabled = !isDevModeEnabled
    }
    
    func exitClick(sender: AnyObject?) {
        NSLog("exitClick")
        
        let alert = NSAlert()
        
        alert.addButton(withTitle: "Turn off")
        alert.addButton(withTitle: "Cancel")
        alert.messageText = "Turn off Blockstack?"
        alert.informativeText = "You will not be able to access the decentralized internet if you turn off Blockstack."
        alert.alertStyle = NSAlertStyle.warning
        
        if alert.runModal() == NSAlertFirstButtonReturn {
            NSLog("User decided to exit...")
            shutdown(terminate: true)
        }
    }
    
    func shutdown(terminate: Bool = true) {
        
        if(!isShutdown) {
            isShutdown = true // prevent shutdown code from running twice
            NSStatusBar.system().removeStatusItem(statusItem)
            portalProxyProcess.terminate()
            NSLog("Blockstack Portal proxy terminated")
            corsProxyProcess.terminate()
            NSLog("CORS proxy terminated")
            
            //            [self stopBlockstackCoreApiAndExit];
        }
        
        if(terminate) {
            NSApplication.shared().terminate(self)
        }
        
   
    }
    

    func startPortalProxy() {
        let proxyPath = Bundle.main.path(forResource: "blockstackProxy", ofType: "")
        let portalPath = Bundle.main.path(forResource: "browser", ofType: "")
        
        NSLog("Portal proxy path: \(proxyPath)")
        NSLog("Portal path: \(portalPath)")
        
        portalProxyProcess.launchPath = proxyPath
        if let portalPath = portalPath {
            portalProxyProcess.arguments = [String(productionModePortalPort), portalPath]
            
            NSLog("Starting Blockstack Portal proxy...")
            
            portalProxyProcess.launch()
        } else {
            NSLog("Error: Portal directory not found!")
        }
    }
    
    func startCorsProxy() {
        let corsProxyPath = Bundle.main.path(forResource: "corsproxy", ofType: "")
        
        NSLog("CORS proxy Path: \(corsProxyPath)")
        
        corsProxyProcess.launchPath = corsProxyPath
        
        NSLog("Starting CORS proxy...")
        
        corsProxyProcess.launch()
    }
    
}

