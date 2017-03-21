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
    
    let keychainServiceName = "blockstack-core-wallet-password"
    let keychainAccountName = "blockstack-core"
    
    let coreArchive = "blockstack-venv.tar.gz"
    let coreConfigFileRelativePath = "config/client.ini"
    let coreVenvDirectory = "blockstack-venv"
    let extractCoreVenvToPath = "/tmp"
    let portalRunDirectory = "portal"
    
    let portalProxyProcess = Process()
    let corsProxyProcess = Process()
    let coreProcess = Process()

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        NSLog("applicationDidFinishLaunching: \(blockstackDataURL())")
        
        let appleEventManager = NSAppleEventManager.shared()
        appleEventManager.setEventHandler(self, andSelector: #selector(handleGetURLEvent), forEventClass: UInt32(kInternetEventClass), andEventID: UInt32(kAEGetURL))
        
        statusItem = NSStatusBar.system().statusItem(withLength: NSSquareStatusItemLength)
        
        if let button = statusItem.button {
            button.image = NSImage(named: "MenuBar")
            button.alternateImage = NSImage(named: "MenuBarDark")
            button.action = #selector(statusItemClick)
        }
        
        let walletPassword = createOrRetrieveCoreWalletPassword()
        
        // using the wallet password as Core API password is intentional
        startPortalProxy(coreAPIPassword: walletPassword)
        
        startCorsProxy()
        
        startCoreAPI(walletPassword: walletPassword, complete: {
            self.openPortal(path: "/")
        })
    }

    func applicationWillTerminate(_ aNotification: Notification) {
        shutdown(terminate: false)
    }
    
    func handleGetURLEvent(_ event: NSAppleEventDescriptor, replyEvent: NSAppleEventDescriptor) {
        let url = (event.paramDescriptor(forKeyword: keyDirectObject)?.stringValue) ?? ""
        let authRequest = url.replacingOccurrences(of: "blockstack:", with: "")
        NSLog("Blockstack URL: \(url)")
        NSLog("Blockstack Auth Request: \(authRequest)")
        
        openPortal(path: "\(portalAuthenticationPath)\(authRequest)")

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
    
    func openProfilesClick(sender: AnyObject?) {
        NSLog("openProfilesClick")
        openPortal(path: "/profiles")
    }
    
    func openWalletClick(sender: AnyObject?) {
        NSLog("openWalletClick")
        openPortal(path: "/wallet/deposit")
    }
    
    func openAccountClick(sender: AnyObject?) {
        NSLog("openAccountClick")
        openPortal(path: "/account/password")
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
        
        if isDevModeEnabled {
            showExpandedMenu = true
        }
        
        menu.addItem(withTitle: "Home", action: #selector(openPortalClick), keyEquivalent: "h")
        menu.addItem(withTitle: "Profiles", action: #selector(openProfilesClick), keyEquivalent: "p")
        menu.addItem(withTitle: "Wallet", action: #selector(openWalletClick), keyEquivalent: "w")
        menu.addItem(withTitle: "Account", action: #selector(openAccountClick), keyEquivalent: "a")
        menu.addItem(NSMenuItem.separator())
        
        if showExpandedMenu {
            
            let portalPortMenuItem = NSMenuItem()
            portalPortMenuItem.title = "Web portal running on port \(portalPort())"
            portalPortMenuItem.isEnabled = false
            menu.addItem(portalPortMenuItem)
            
            let corsProxyPortMenuItem = NSMenuItem()
            corsProxyPortMenuItem.title = "CORS proxy running on port \(corsProxyPort)"
            corsProxyPortMenuItem.isEnabled = false
            menu.addItem(corsProxyPortMenuItem)
            
            let corePortMenuItem = NSMenuItem()
            corePortMenuItem.title = "Core node running on port \(coreProxyPort)"
            corePortMenuItem.isEnabled = false
            menu.addItem(corePortMenuItem)
            
            menu.addItem(NSMenuItem.separator())
            
            let devModeStatusMenuItem = NSMenuItem()
            devModeStatusMenuItem.title = "Development Mode: \(isDevModeEnabled ? "Enabled" : "Disabled")"
            devModeStatusMenuItem.isEnabled = false
            menu.addItem(devModeStatusMenuItem)
            
            menu.addItem(withTitle: "\(isDevModeEnabled ? "Disable" : "Enable") Development Mode", action: #selector(devModeClick), keyEquivalent: "d")
            
            menu.addItem(NSMenuItem.separator())

        }
        
        menu.addItem(withTitle: "Quit Blockstack", action: #selector(exitClick), keyEquivalent: "q")
        
        statusItem.popUpMenu(menu)
    }
    
    func devModeClick(sender: AnyObject?) {
        NSLog("devModeClick")
        isDevModeEnabled = !isDevModeEnabled
    }
    
    func exitClick(sender: AnyObject?) {
        NSLog("exitClick")
        
        let alert = NSAlert()
        
        alert.addButton(withTitle: "Quit")
        alert.addButton(withTitle: "Cancel")
        alert.messageText = "Quit Blockstack?"
        alert.informativeText = "You will not be able to access the decentralized internet if you quit Blockstack."
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
            
            stopCoreAPI(terminationHandler: {
                if(terminate) {
                    NSApplication.shared().terminate(self)
                    NSLog("Goodbye!")
                }
            })
        }
    }
    
    func startPortalProxy(coreAPIPassword: String) {
        let proxyPath = Bundle.main.path(forResource: "blockstackProxy", ofType: "")
        let portalPath = Bundle.main.path(forResource: "browser", ofType: "")
        
        NSLog("Portal proxy path: \(proxyPath)")
        NSLog("Portal path: \(portalPath)")
        
        do {
            NSLog("Trying to remove any existing portal code...")
            try FileManager.default.removeItem(atPath: portalRunPath())
        } catch {
            NSLog("Can't remove existing portal code. It probably doesn't exist.")
        }
        
        NSLog("Copying the latest portal code into the portal run path \(portalRunPath())")

        do {
            try FileManager.default.copyItem(atPath: portalPath!, toPath: portalRunPath())
        } catch {
            NSLog("Can't copy Portal code to the run path: \(portalRunPath())")
        }
        
        /* Configure the Core API Password */
        
        /* This searches through the uglified Portal JavaScript and replaces
         * the placeholder Core API password with the real password. */
        
        let sedCommand = "s/REPLACE_ME_WITH_CORE_API_PASSWORD/\(coreAPIPassword)/g"
        
        NSLog("Preparing to configure Core API password with this sed command: \(sedCommand)")
        
        let configureCoreApiPasswordProcess = Process()
let apiPasswordPipe = loggingPipe()
        configureCoreApiPasswordProcess.launchPath = "/usr/bin/sed"
        configureCoreApiPasswordProcess.arguments =
            ["-i", "", "-e", sedCommand, "\(portalRunPath())/js/main.js"]
        configureCoreApiPasswordProcess.standardOutput = apiPasswordPipe
        configureCoreApiPasswordProcess.standardError = apiPasswordPipe
        configureCoreApiPasswordProcess.terminationHandler = { process in
            NSLog("Finished configuring Core API password!")
            
            self.portalProxyProcess.launchPath = proxyPath
 
            self.portalProxyProcess.arguments = [String(self.productionModePortalPort), self.portalRunPath()]
                
            NSLog("Starting Blockstack Portal proxy...")
                
            self.portalProxyProcess.launch()

        }
        configureCoreApiPasswordProcess.launch()
 
    }
    
    func startCorsProxy() {
        let corsProxyPath = Bundle.main.path(forResource: "corsproxy", ofType: "")
        
        NSLog("CORS proxy Path: \(corsProxyPath)")
        
        corsProxyProcess.launchPath = corsProxyPath
        
        NSLog("Starting CORS proxy...")
        
        corsProxyProcess.launch()
    }
    
    /* Blockstack Core */
    
    func startCoreAPI(walletPassword: String, complete: @escaping () -> Void) {
        if let archivePath = Bundle.main.path(forResource: coreArchive, ofType: "") {
            NSLog("Blockstack Virtualenv archive path: \(archivePath)")
            
            NSLog("Extract Core venv to: \(extractCoreVenvToPath)")
            NSLog("Blockstack Core config file path: \(coreConfigPath())")
            NSLog("Blockstack Virtualenv Path: \(coreVenvPath())")
            NSLog("Blockstack path: \(blockstackPath())")
            
            let extractProcess = Process()
            let coreAPISetupProcess = Process()
            let coreAPIStartProcess = Process()
            
            do {
                // see https://github.com/blockstack/blockstack-core/issues/345#issuecomment-288098844
                NSLog("Trying to remove existing config file because format changes between Core upgrades can break things.")
                try FileManager.default.removeItem(atPath: coreConfigPath())
            } catch {
                NSLog("Can't remove existing config file. It probably doesn't exist.")
            }

            
            /* Extract Blockstack Core virtualenv task */
            
            let extractPipe = loggingPipe()
            extractProcess.launchPath = "/usr/bin/tar"
            extractProcess.arguments = ["-xvzf", archivePath, "-C", extractCoreVenvToPath];
            extractProcess.standardOutput = extractPipe
            extractProcess.standardError = extractPipe
            extractProcess.terminationHandler = { process in
                NSLog("Finished extraction!")
                NSLog("Setting up Blockstack Core...")
                coreAPISetupProcess.launch()
            }
            
            
            
            /* Blockstack Core setup task */
            
            coreAPISetupProcess.launchPath = blockstackPath()
            coreAPISetupProcess.arguments = ["--debug", "-y", "--config", coreConfigPath(), "setup", "--password", walletPassword]
            
            let coreAPISetupPipe = loggingPipe()
            coreAPISetupProcess.standardOutput = coreAPISetupPipe
            coreAPISetupProcess.standardError = coreAPISetupPipe
            
            coreAPISetupProcess.terminationHandler = { process in
                NSLog("Finished Blockstack Core setup!");
                NSLog("Starting Blockstack Core API endpoint...");
                coreAPIStartProcess.launch()
            }
            
            
            /* Blockstack Core API start task */
            
            coreAPIStartProcess.launchPath = blockstackPath()
            coreAPIStartProcess.arguments = ["--debug", "-y", "--config", coreConfigPath(), "api", "start", "--password", walletPassword]
            
            let coreAPIStartPipe = loggingPipe()
            coreAPIStartProcess.standardOutput = coreAPIStartPipe
            coreAPIStartProcess.standardError = coreAPIStartPipe
            
            coreAPIStartProcess.terminationHandler = { process in
                NSLog("Blockstack Core API started!")
                complete()
            }
            
            NSLog("Starting Blockstack Core Virtualenv extraction...")
            extractProcess.launch()
            
        } else {
            NSLog("Error: Blockstack Core Virtualenv archive file not found!")
        }
        
    }
    
    func stopCoreAPI(terminationHandler:@escaping () -> Void) {
        NSLog("Attempting to stop Blockstack Core API...")
        
        let coreAPIStopProcess = Process()
        
        coreAPIStopProcess.launchPath = blockstackPath()
        coreAPIStopProcess.arguments = ["--debug", "-y", "--config", coreConfigPath(), "api", "stop"]
        
        let coreAPIStopPipe = loggingPipe()
        coreAPIStopProcess.standardOutput = coreAPIStopPipe
        coreAPIStopProcess.standardError = coreAPIStopPipe
        
        coreAPIStopProcess.terminationHandler = { process in
            NSLog("Blockstack Core api stopped.")
            terminationHandler()
        }
        
        coreAPIStopProcess.launch()
    }

    func blockstackPath() -> String {
        return coreVenvPath() + "/bin/blockstack"
    }
    
    func coreVenvPath() -> String {
        return extractCoreVenvToPath  + "/\(coreVenvDirectory)"
    }
    
    func coreConfigPath() -> String {
        return blockstackDataURL().path + "/\(coreConfigFileRelativePath)"
    }
    
    func portalRunPath() -> String {
        return blockstackDataURL().path + "/\(portalRunDirectory)"
    }
    
    func blockstackDataURL() -> URL {
        let applicationSupportDirectory = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        
        //NSLog("Application Support directory: \(applicationSupportDirectory)")
        
        let blockstackDataPath = applicationSupportDirectory.appendingPathComponent("Blockstack")
        
        //NSLog("Blockstack data directory: \(blockstackDataPath)")
        
        do {
            try FileManager.default.createDirectory(atPath: blockstackDataPath.path, withIntermediateDirectories: false, attributes: nil)
        } catch {
            //NSLog("Blockstack data directory probably already exists: \(error)")
        }
        
        return blockstackDataPath
    }
    
    
    /* Keychain management of Blockstack Core wallet password */
    
    func createOrRetrieveCoreWalletPassword() -> String {
        
        let serviceNameData = (keychainServiceName as NSString).utf8String
        let accountNameData = (keychainAccountName as NSString).utf8String
        
        var passwordLength : UInt32 = 0
        var passwordData : UnsafeMutableRawPointer? = nil
        
        var unmanagedItem : SecKeychainItem? = nil
        
        let keychains : CFTypeRef? = nil // use the default keychain
        
        
        let status = SecKeychainFindGenericPassword(keychains, UInt32(strlen(serviceNameData)), serviceNameData, UInt32(strlen(accountNameData)), accountNameData, &passwordLength, &passwordData, &unmanagedItem)
        if(status == errSecSuccess) {
            let password = String(NSString(bytes: UnsafeMutableRawPointer(passwordData)!, length: Int(passwordLength), encoding: String.Encoding.utf8.rawValue)!)
            SecKeychainItemFreeContent(nil, passwordData) // free memory
            NSLog("Blockstack Core wallet password found in keychain")
            return password
        } else {
            NSLog("Blockstack Core wallet password not found in keychain: \(SecCopyErrorMessageString(status, nil))")
            SecKeychainItemFreeContent(nil, passwordData) // free memory
            
            return createOrRetrieveCoreWalletPassword()
        }
    }
    
    func createAndStorePasswordInKeychain() -> String {
        let serviceNameData = (keychainServiceName as NSString).utf8String
        let accountNameData = (keychainAccountName as NSString).utf8String
        
        let password : String = generatePassword()
        let passwordData = (password as NSString).utf8String
        
        var unmanagedItem : SecKeychainItem? = nil
        
        let keychains : SecKeychain? = nil // use the default keychain
        
        let status = SecKeychainAddGenericPassword(keychains, UInt32(strlen(serviceNameData)), serviceNameData, UInt32(strlen(accountNameData)), accountNameData, UInt32(strlen(passwordData)), passwordData!, &unmanagedItem)
        
        if(status != errSecSuccess) {
            NSLog("Problem storing Blockstack Core wallet password to Keychain \(SecCopyErrorMessageString(status, nil))");
        }
        
        return password
    }
    
    func generatePassword() -> String {
        // this isn't necessarily secure or random, but good enough for our purposes.
        return ProcessInfo.processInfo.globallyUniqueString
    }
    
    func loggingPipe() -> Pipe {
        let pipe = Pipe()
        pipe.fileHandleForReading.readabilityHandler = { pipe in
            
            if let line = String(data: pipe.availableData, encoding: String.Encoding.utf8) {
                NSLog(line)
            } else {
                NSLog("Error decoding data: \(pipe.availableData)")
            }
        }
        return pipe
    }
    

    
}

