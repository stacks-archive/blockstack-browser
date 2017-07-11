//
//  AppDelegate.swift
//  Blockstack
//
//  Created by Larry Salibra on 2/26/17.
//  Copyright © 2017 Blockstack. All rights reserved.
//

import Cocoa
import Sparkle
import os.log

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
<<<<<<< HEAD
    
    var mainWindowController: MainWindowController? = nil
    
    var mainWindow = NSWindow(contentRect: NSMakeRect(0, 0, 900, 700),
                              styleMask: [.titled, .closable, .miniaturizable, .resizable],
                              backing: .buffered, defer: false)
    
    var browserViewController: BrowserViewController? = nil
    
=======


>>>>>>> v0.11
    let productionModePortalPort = 8888
    let developmentModePortalPort = 3000
    let corsProxyPort = 1337
    let coreProxyPort = 6270
    let portalAuthenticationPath = "/auth?authRequest="

    var statusItem : NSStatusItem = NSStatusItem()

    var isDevModeEnabled : Bool = false

    var isRegTestModeEnabled : Bool = false
    var isRegTestModeChanging : Bool = false
    let regTestCoreAPIPassword = "blockstack_integration_test_api_password"

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

    let sparkleUpdater = SUUpdater.init(for: Bundle.main)

    var portalLogServer:PortalLogServer? = nil
    let logServerPort = 8333

    let log = OSLog(subsystem: Bundle.main.bundleIdentifier!, category: "Default")

    func applicationDidFinishLaunching(_ aNotification: Notification) {
        os_log("applicationDidFinishLaunching: %{public}@", log: log, type: .default, blockstackDataURL().absoluteString)

        portalLogServer = PortalLogServer.init(port: UInt16(logServerPort), password: self.createOrRetrieveCoreWalletPassword())

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
        startPortalProxy(complete: {
            let delayInSeconds = 0.5
            DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + delayInSeconds) {
                self.createMainWindow()
                self.openPortal(path: "/")
            }
        })

        startCorsProxy(complete: {
            // do nothing on task completion
        })

        startCoreAPI(walletPassword: walletPassword, complete: {
            // do nothing on task completion
        })
        
    }
    

    func applicationWillTerminate(_ aNotification: Notification) {
        shutdown(terminate: false)
    }

    func handleGetURLEvent(_ event: NSAppleEventDescriptor, replyEvent: NSAppleEventDescriptor) {
        let url = (event.paramDescriptor(forKeyword: keyDirectObject)?.stringValue) ?? ""
        let authRequest = url.replacingOccurrences(of: "blockstack:", with: "")
        os_log("Blockstack URL: %{public}@", log: log, type: .info, url)
        os_log("Blockstack Auth Request: %{public}@", log: log, type: .debug, authRequest)

        openPortal(path: "\(portalAuthenticationPath)\(authRequest)")

    }
    
    func createMainWindow() {
        NSLog("createMainWindow")
        mainWindowController = MainWindowController(window: mainWindow)
        
        browserViewController = BrowserViewController()
        browserViewController?.appDelegate = self
        
        mainWindow.contentView!.addSubview(browserViewController!.view)
        mainWindowController!.showWindow(self)
    }

    func portalBaseUrl() -> String {
        return "http://localhost:\(portalPort())"
    }
<<<<<<< HEAD
    
    public func portalPort() -> Int {
=======

    func portalPort() -> Int {
>>>>>>> v0.11
        return isDevModeEnabled ? developmentModePortalPort : productionModePortalPort
    }

    func openPortalClick(sender: AnyObject?) {
        os_log("openPortalClick", log: log, type: .debug)
        openPortal(path: "/")
    }

    func openProfilesClick(sender: AnyObject?) {
        os_log("openProfilesClick", log: log, type: .debug)
        openPortal(path: "/profiles")
    }

    func openStorageClick(sender: AnyObject?) {
        os_log("openStorageClick", log: log, type: .debug)
        openPortal(path: "/account/storage")
    }

    func openWalletClick(sender: AnyObject?) {
        os_log("openWalletClick", log: log, type: .debug)
        openPortal(path: "/wallet/receive")
    }

    func openAccountClick(sender: AnyObject?) {
        os_log("openAccountClick", log: log, type: .debug)
        openPortal(path: "/account/password")
    }

    func openPortal(path: String) {
        let portalURLString = "\(portalBaseUrl())\(path)"
        os_log("Opening portal with String: %{public}@", log: log, type: .info, portalURLString)
        let portalURLWithSecretString = "\(portalURLString)#coreAPIPassword=\(createOrRetrieveCoreWalletPassword())"
        let portalURLWithSecretAndLogPortString = "\(portalURLWithSecretString)&logServerPort=\(logServerPort)"
        let portalURL = URL(string: portalURLWithSecretAndLogPortString )
        mainWindowController?.showWindow(self)
        NSApp.activate(ignoringOtherApps: true)
        browserViewController!.open(url: portalURL)
    }

    func statusItemClick(sender: AnyObject?) {
        os_log("statusItemClick", log: log, type: .debug)

        let menu = NSMenu()

        var showExpandedMenu = false

        if(NSApp.currentEvent?.modifierFlags.contains(NSEventModifierFlags.option) ?? false) {
            os_log("Option click", log: log, type: .debug)
            showExpandedMenu = true
        }

        if isDevModeEnabled {
            showExpandedMenu = true
        }

        menu.addItem(withTitle: "Home", action: #selector(openPortalClick), keyEquivalent: "h")
        menu.addItem(withTitle: "Profiles", action: #selector(openProfilesClick), keyEquivalent: "p")
        menu.addItem(withTitle: "Storage", action: #selector(openStorageClick), keyEquivalent: "s")
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
            var title = "Core node running on port \(coreProxyPort)"
            if(isRegTestModeChanging) {
                title = "Core node changing regtest mode state..."
            } else if(isRegTestModeEnabled) {
                title = "Core node is not running. Please start your regtest core node."
            }
            corePortMenuItem.title = title
            corePortMenuItem.isEnabled = false
            menu.addItem(corePortMenuItem)

            if(isDevModeEnabled) {
                menu.addItem(NSMenuItem.separator())
                menu.addItem(withTitle: "Copy Core API password", action: #selector(copyAPIKeyClick), keyEquivalent: "")
            }

            menu.addItem(NSMenuItem.separator())

            let devModeStatusMenuItem = NSMenuItem()
            devModeStatusMenuItem.title = "Development Mode: \(isDevModeEnabled ? "Enabled" : "Disabled")"
            devModeStatusMenuItem.isEnabled = false
            menu.addItem(devModeStatusMenuItem)

            let devModeMenuItem = NSMenuItem()
            devModeMenuItem.title = "\(isDevModeEnabled ? "Disable" : "Enable") Development Mode"

            if(!isRegTestModeEnabled && !isRegTestModeChanging) {
            devModeMenuItem.action = #selector(devModeClick)
            devModeMenuItem.keyEquivalent = "d"
            }

            menu.addItem(devModeMenuItem)

            menu.addItem(NSMenuItem.separator())

            let regTestModeStatusMenuItem = NSMenuItem()
            regTestModeStatusMenuItem.title = "Regtest Mode: \(isRegTestModeEnabled ? "Enabled" : "Disabled")"
            menu.addItem(regTestModeStatusMenuItem)

            if(isDevModeEnabled) {
                let regTestModeMenuItem = NSMenuItem()
                regTestModeMenuItem.title = "\(isRegTestModeEnabled ? "Disable" : "Enable") Regtest Mode"

                if(!isRegTestModeChanging) {
                    regTestModeMenuItem.action = #selector(regTestModeClick)
                    regTestModeMenuItem.keyEquivalent = "r"
                }

                menu.addItem(regTestModeMenuItem)
            }


            menu.addItem(NSMenuItem.separator())

            let version = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as! String
            let build = Bundle.main.object(forInfoDictionaryKey: "CFBundleVersion") as! String

            let versionMenuItem = NSMenuItem()
            versionMenuItem.title = "Blockstack v\(version) (\(build))"
            versionMenuItem.isEnabled = false
            menu.addItem(versionMenuItem)
            menu.addItem(withTitle: "Check for updates...", action: #selector(checkForUpdatesClick), keyEquivalent: "u")

            menu.addItem(NSMenuItem.separator())
        }

        menu.addItem(withTitle: "Quit Blockstack", action: #selector(exitClick), keyEquivalent: "q")

        statusItem.popUpMenu(menu)
    }

    func copyAPIKeyClick(sender: AnyObject?) {
        os_log("copyAPIKeyClick", log: log, type: .debug)
        let pasteboard = NSPasteboard.general()
        pasteboard.declareTypes([NSPasteboardTypeString], owner: nil)
        if(isRegTestModeEnabled) {
            os_log("copying regtest core api password", log: log, type: .debug)
            pasteboard.setString(regTestCoreAPIPassword, forType: NSPasteboardTypeString)
        } else {
            os_log("copying production core api password", log: log, type: .debug)
            pasteboard.setString(createOrRetrieveCoreWalletPassword(), forType: NSPasteboardTypeString)
        }
    }

    func devModeClick(sender: AnyObject?) {
        os_log("devModeClick", log: log, type: .debug)
        isDevModeEnabled = !isDevModeEnabled
    }
    
    func regTestModeClick(sender: AnyObject?) {
        os_log("regTestModeClick", log: log, type: .debug)
        if(!isRegTestModeChanging) {
            isRegTestModeChanging = true
            os_log("Stopping log server...", log: log, type: .debug)
            portalLogServer?.server.stop()
            if(!isRegTestModeEnabled) {
                os_log("Preparing to stop bundled Core API endpoint for reg test mode...", log: log, type: .debug)
                stopCoreAPI(terminationHandler: {
                    self.isRegTestModeChanging = false
                    self.isRegTestModeEnabled = true
                    os_log("Restarting log server with new API password", log: self.log, type: .debug)
                    self.portalLogServer = PortalLogServer.init(port: UInt16(self.logServerPort), password: self.createOrRetrieveCoreWalletPassword())
                })
            } else {
                os_log("Exiting reg test mode: restarting bundled Core API endpoint...", log: log, type: .debug)
                let walletPassword = createOrRetrieveCoreWalletPassword()
                portalLogServer = PortalLogServer.init(port: UInt16(logServerPort), password: self.createOrRetrieveCoreWalletPassword())
                startCoreAPI(walletPassword: walletPassword, complete: {
                    self.isRegTestModeChanging = false
                    self.isRegTestModeEnabled = false
                    os_log("Restarting log server with new API password", log: self.log, type: .debug)
                    self.portalLogServer = PortalLogServer.init(port: UInt16(self.logServerPort), password: self.createOrRetrieveCoreWalletPassword())

                })
            }
        } else {
            os_log("Regtest mode is already changing. Doing nothing.", log: log, type: .debug)
        }
    }


    func exitClick(sender: AnyObject?) {
        os_log("exitClick", log: log, type: .debug)

        let alert = NSAlert()

        alert.addButton(withTitle: "Quit")
        alert.addButton(withTitle: "Cancel")
        alert.messageText = "Quit Blockstack?"
        alert.informativeText = "You will not be able to access the decentralized internet if you quit Blockstack."
        alert.alertStyle = NSAlertStyle.warning

        if alert.runModal() == NSAlertFirstButtonReturn {
            os_log("User decided to exit...", log: log, type: .info)
            shutdown(terminate: true)
        }
    }

    func checkForUpdatesClick(sender: AnyObject?) {
        os_log("checkForUpdatesClick", log: log, type: .debug)
        sparkleUpdater?.checkForUpdates(nil)
    }

    func shutdown(terminate: Bool = true) {
        if(!isShutdown) {
            isShutdown = true // prevent shutdown code from running twice
            NSStatusBar.system().removeStatusItem(statusItem)

            portalProxyProcess.terminate()
            os_log("Blockstack Portal proxy terminated", log: log, type: .default)

            corsProxyProcess.terminate()
            os_log("CORS proxy terminated", log: log, type: .default)

            stopCoreAPI(terminationHandler: {
                if(terminate) {
                    NSApplication.shared().terminate(self)
                    os_log("Goodbye!", log: self.log, type: .default)
                }
            })
        }
    }

    func startPortalProxy(complete: @escaping () -> Void) {
        let proxyPath = Bundle.main.path(forResource: "blockstackProxy", ofType: "")
        let portalPath = Bundle.main.path(forResource: "browser", ofType: "")

        os_log("Portal proxy path: %{public}@", log: log, type: .info, proxyPath!)
        os_log("Portal path: %{public}@", log: log, type: .info, portalPath!)

        do {
            os_log("Trying to remove any existing portal code...", log: log, type: .info)
            try FileManager.default.removeItem(atPath: portalRunPath())
        } catch {
            os_log("Can't remove existing portal code. It probably doesn't exist.", log: log, type: .info)
        }

        os_log("Copying the latest portal code into the portal run path %{public}@", log: log, type: .info, portalRunPath())

        do {
            try FileManager.default.copyItem(atPath: portalPath!, toPath: portalRunPath())
        } catch {
            os_log("Can't copy Portal code to the run path: %{public}@", log: log, type: .error, portalRunPath())
        }


        self.portalProxyProcess.launchPath = proxyPath

        self.portalProxyProcess.arguments = [String(self.productionModePortalPort), self.portalRunPath()]

        os_log("Starting Blockstack Portal proxy...", log: log, type: .default)

        self.portalProxyProcess.launch()
        complete()

    }

    func startCorsProxy(complete: @escaping () -> Void) {
        let corsProxyPath = Bundle.main.path(forResource: "corsproxy", ofType: "")

        os_log("CORS proxy Path: %{public}@", log: log, type: .info, corsProxyPath!)

        corsProxyProcess.launchPath = corsProxyPath

        os_log("Starting CORS proxy...", log: log, type: .default)

        corsProxyProcess.launch()
        complete()
    }

    /* Blockstack Core */

    func startCoreAPI(walletPassword: String, complete: @escaping () -> Void) {
        if let archivePath = Bundle.main.path(forResource: coreArchive, ofType: "") {
            os_log("Blockstack Virtualenv archive path: %{public}@", log: log, type: .info, archivePath)

            os_log("Extract Core venv to: %{public}@", log: log, type: .info, extractCoreVenvToPath)
            os_log("Blockstack Core config file path: %{public}@", log: log, type: .info, coreConfigPath())
            os_log("Blockstack Virtualenv Path: %{public}@", log: log, type: .info, coreVenvPath())
            os_log("Blockstack path: %{public}@", log: log, type: .info, blockstackPath())
            os_log("Python path: %{public}@", log: log, type: .info, pythonPath())

            let extractProcess = Process()
            let coreAPISetupProcess = Process()
            let coreAPIStartProcess = Process()

            do {
                // see https://github.com/blockstack/blockstack-core/issues/345#issuecomment-288098844
                os_log("Trying to remove existing config file because format changes between Core upgrades can break things.", log: log, type: .info)
                try FileManager.default.removeItem(atPath: coreConfigPath())
            } catch {
                os_log("Can't remove existing config file. It probably doesn't exist.", log: log, type: .info)
            }


            /* Extract Blockstack Core virtualenv task */

            let extractPipe = loggingPipe()
            extractProcess.launchPath = "/usr/bin/tar"
            extractProcess.arguments = ["-xvzf", archivePath, "-C", extractCoreVenvToPath];
            extractProcess.standardOutput = extractPipe
            extractProcess.standardError = extractPipe
            extractProcess.terminationHandler = { process in
                os_log("Finished extraction!", log: self.log, type: .default)
                os_log("Setting up Blockstack Core...", log: self.log, type: .default)
                coreAPISetupProcess.launch()
            }



            /* Blockstack Core setup task */

            coreAPISetupProcess.launchPath = pythonPath()
            coreAPISetupProcess.arguments = [blockstackPath(), "--debug", "-y", "--config", coreConfigPath(), "setup_wallet", "--password", walletPassword, "--api_password", walletPassword]

            let coreAPISetupPipe = loggingPipe()
            coreAPISetupProcess.standardOutput = coreAPISetupPipe
            coreAPISetupProcess.standardError = coreAPISetupPipe

            coreAPISetupProcess.terminationHandler = { process in
                os_log("Finished Blockstack Core setup!", log: self.log, type: .default)
                os_log("Starting Blockstack Core API endpoint...", log: self.log, type: .default)
                coreAPIStartProcess.launch()
            }


            /* Blockstack Core API start task */

            coreAPIStartProcess.launchPath = pythonPath()
            coreAPIStartProcess.arguments = [blockstackPath(), "--debug", "-y", "--config", coreConfigPath(), "api", "start", "--password", walletPassword, "--api_password", walletPassword]

            let coreAPIStartPipe = loggingPipe()
            coreAPIStartProcess.standardOutput = coreAPIStartPipe
            coreAPIStartProcess.standardError = coreAPIStartPipe

            coreAPIStartProcess.terminationHandler = { process in
                os_log("Blockstack Core API started!", log: self.log, type: .default)
                complete()
            }

            os_log("Starting Blockstack Core Virtualenv extraction...", log: log, type: .default)
            extractProcess.launch()

        } else {
            os_log("Error: Blockstack Core Virtualenv archive file not found!", log: log, type: .error)
        }

    }

    func stopCoreAPI(terminationHandler:@escaping () -> Void) {
        os_log("Attempting to stop Blockstack Core API...", log: log, type: .default)

        let coreAPIStopProcess = Process()

        coreAPIStopProcess.launchPath = pythonPath()
        coreAPIStopProcess.arguments = [blockstackPath(), "--debug", "-y", "--config", coreConfigPath(), "api", "stop"]

        let coreAPIStopPipe = loggingPipe()
        coreAPIStopProcess.standardOutput = coreAPIStopPipe
        coreAPIStopProcess.standardError = coreAPIStopPipe

        coreAPIStopProcess.terminationHandler = { process in
            os_log("Blockstack Core api stopped.", log: self.log, type: .default)
            terminationHandler()
        }

        coreAPIStopProcess.launch()
    }

    func pythonPath() -> String {
        return coreVenvPath() + "/bin/python2.7"
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

        os_log("Application Support directory: %{public}@", log: log, type: .debug, applicationSupportDirectory.absoluteString)

        let blockstackDataPath = applicationSupportDirectory.appendingPathComponent("Blockstack")

        os_log("Blockstack data directory: %{public}@", log: log, type: .debug, blockstackDataPath.absoluteString)

        do {
            try FileManager.default.createDirectory(atPath: blockstackDataPath.path, withIntermediateDirectories: false, attributes: nil)
        } catch {
            os_log("Blockstack data directory probably already exists", log: log, type: .debug)
        }

        return blockstackDataPath
    }


    /* Keychain management of Blockstack Core wallet password */

    func createOrRetrieveCoreWalletPassword() -> String {
        os_log("createOrRetrieveCoreWalletPassword", log: log, type: .debug)
        if(isRegTestModeEnabled && !isRegTestModeChanging) {
            return regTestCoreAPIPassword
        }

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
            os_log("Blockstack Core wallet password found in keychain", log: log, type: .info)
            return password
        } else {
            os_log("Blockstack Core wallet password not found in keychain: %{public}@", log: log, type: .info, SecCopyErrorMessageString(status, nil) as! CVarArg)
            SecKeychainItemFreeContent(nil, passwordData) // free memory

            return createAndStorePasswordInKeychain()
        }
    }

    func createAndStorePasswordInKeychain() -> String {
        os_log("createAndStorePasswordInKeychain", log: log, type: .debug)
        let serviceNameData = (keychainServiceName as NSString).utf8String
        let accountNameData = (keychainAccountName as NSString).utf8String

        let password : String = generatePassword()
        let passwordData = (password as NSString).utf8String

        var unmanagedItem : SecKeychainItem? = nil

        let keychains : SecKeychain? = nil // use the default keychain

        os_log("Storing new password in Keychain: service name: %{public} account name: %{public}@", keychainServiceName, keychainAccountName)
        let status = SecKeychainAddGenericPassword(keychains, UInt32(strlen(serviceNameData)), serviceNameData, UInt32(strlen(accountNameData)), accountNameData, UInt32(strlen(passwordData)), passwordData!, &unmanagedItem)

        if(status != errSecSuccess) {
            os_log("Problem storing Blockstack Core wallet password to Keychain %{public}@", log: log, type: .error, (SecCopyErrorMessageString(status, nil) as! CVarArg))
        }

        return password
    }

    func generatePassword() -> String {
        os_log("generatePassword", log: log, type: .debug)
        // this isn't necessarily secure or random, but good enough for our purposes.
        return ProcessInfo.processInfo.globallyUniqueString
    }

    func loggingPipe() -> Pipe {
        let pipe = Pipe()
        pipe.fileHandleForReading.readabilityHandler = { pipe in

            if let line = String(data: pipe.availableData, encoding: String.Encoding.utf8) {
                os_log("%{public}@", log: self.log, type: .debug, line)
            } else {
                os_log("Error decoding data: %{public}@", log: self.log, type: .error, pipe.availableData as CVarArg)
            }
        }
        return pipe
    }



}
