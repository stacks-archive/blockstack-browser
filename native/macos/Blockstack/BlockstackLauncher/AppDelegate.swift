//
//  AppDelegate.swift
//  BlockstackLauncher
//
//  Created by Yukan Liao on 2017-08-12.
//  Copyright © 2017 Blockstack. All rights reserved.
//

import Cocoa
import os.log

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
    
    func applicationDidFinishLaunching(_ aNotification: Notification) {
        
        let mainAppIdentifier = "org.blockstack.mac"
        var mainAppRunning = false
        
        if !NSRunningApplication.runningApplications(withBundleIdentifier: mainAppIdentifier).isEmpty {
            mainAppRunning = true
        }
        
        if !mainAppRunning {
            DistributedNotificationCenter.default().addObserver(self, selector: #selector(terminate), name: Notification.Name("kill"), object: mainAppIdentifier)
            
            let path = Bundle.main.bundlePath as NSString
            var components = path.pathComponents
            components.removeLast(3)
            components.append("MacOS")
            components.append("Blockstack")
            
            let newPath = NSString.path(withComponents: components)
            NSWorkspace.shared().launchApplication(newPath)
        }
        else {
            terminate()
        }
    }
    
    func terminate() {
        NSApplication.shared().terminate(self)
    }
    
    func applicationWillTerminate(_ aNotification: Notification) {
        
    }
    
    
}

