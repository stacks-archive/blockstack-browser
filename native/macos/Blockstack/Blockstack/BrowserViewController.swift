//
//  BrowserViewController.swift
//  Blockstack
//
//  Created by Larry Salibra on 7/6/17.
//  Copyright © 2017 Blockstack. All rights reserved.
//

import Foundation
import Cocoa
import WebKit

class BrowserViewController: NSViewController, WKUIDelegate, WKNavigationDelegate {
    @IBOutlet weak var webView: WKWebView!
    public weak var appDelegate : AppDelegate? = nil
    
    
    
    func open(url: URL?) {
        let request = URLRequest(url: url!)
        webView.load(request)
    }
    

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        let url : URL = navigationAction.request.url!
        
        NSLog(url.absoluteString)
        
        let browserPort = appDelegate!.portalPort()
        
        if((url.host! == "localhost" && url.port == browserPort) ||
            url.host! == "www.dropbox.com") {
            decisionHandler(.allow)
        } else {
            NSWorkspace.shared().open(url)
            decisionHandler(.cancel)
            appDelegate!.mainWindow.orderOut(self)
        }
    }

}
