//
//  MainWindowController.swift
//  Blockstack
//
//  Created by Larry Salibra on 7/6/17.
//  Copyright © 2017 Blockstack. All rights reserved.
//

import Foundation
import Cocoa

class MainWindowController : NSWindowController {

    override init(window: NSWindow?) {
        super.init(window: window)
        window!.center()
        window!.title = "Blockstack"
        window!.windowController = self
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
    }
    
    override func windowDidLoad() {
        super.windowDidLoad()
        NSLog("windowDidLoad")
    }
    
}
