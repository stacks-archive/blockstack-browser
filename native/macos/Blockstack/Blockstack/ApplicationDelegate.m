#import "ApplicationDelegate.h"

@implementation ApplicationDelegate

@synthesize blockstackProxyTask;
@synthesize corsProxyTask;
@synthesize blockstackCoreConfigFilePath;
@synthesize blockstackPath;
@synthesize statusItem;
@synthesize devModeEnabled;

@synthesize prodModePortalPort = _prodModePortalPort;
@synthesize devModePortalPort = _devModePortalPort;
@synthesize corsProxyPort = _corsProxyPort;



- (void)dealloc
{
}

-(void)applicationWillFinishLaunching:(NSNotification *)aNotification
{
    NSAppleEventManager *appleEventManager = [NSAppleEventManager sharedAppleEventManager];
    [appleEventManager setEventHandler:self
                           andSelector:@selector(handleGetURLEvent:withReplyEvent:)
                         forEventClass:kInternetEventClass andEventID:kAEGetURL];
}

- (void)handleGetURLEvent:(NSAppleEventDescriptor *)event withReplyEvent:(NSAppleEventDescriptor *)replyEvent
{
    NSURL *url = [NSURL URLWithString:[[event paramDescriptorForKeyword:keyDirectObject] stringValue]];
    NSLog(@"Blockstack URL: %@", url);
    NSLog(@"Blockstack URL host: %@", [url host]);
    
    NSString* portalPath = [NSString stringWithFormat:@"%@%@", [self portalAuthPath], [url host]];
    [self launchBrowser:portalPath];
}

- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
    _prodModePortalPort = 8888;
    _devModePortalPort = 3000;
    _corsProxyPort = 1337;
    
    self.devModeEnabled = NO;
    
    // Add our icon to menu bar
    self.statusItem = [[NSStatusBar systemStatusBar] statusItemWithLength:NSVariableStatusItemLength];
    self.statusItem.highlightMode = YES;
    self.statusItem.button.image = [NSImage imageNamed:@"MenuBar"];
    self.statusItem.button.alternateImage = [NSImage imageNamed:@"MenuBarDark"];
    self.statusItem.button.target = self;
    self.statusItem.action = @selector(statusItemClick:);
    
    
    NSString* coreWalletPassword = [self createOrRetrieveCoreWalletPassword];
    
    //[self startBlockstackProxy];
    //[self startCorsProxy];
    //[self startBlockstackCoreApiwithCoreWalletPassword:coreWalletPassword];
    
    [self performSelector:@selector(launchBrowser) withObject:self afterDelay:LAUNCH_BROWSER_DELAY];
    
}

- (NSApplicationTerminateReply)applicationShouldTerminate:(NSApplication *)sender
{
    // Explicitly remove the icon from the menu bar
    [[NSStatusBar systemStatusBar] removeStatusItem:self.statusItem];
    [self.blockstackProxyTask terminate];
    [self.corsProxyTask terminate];
    [self stopBlockstackCoreApiAndExit];
    return NSTerminateNow;
}

- (void)statusItemClick:(id)sender
{
    NSMenu *menu = [[NSMenu alloc] init];
    
    
    NSLog(@"statusItemClick");
    
    if ((([[NSApp currentEvent] modifierFlags] & NSEventModifierFlagOption) != 0)
        || self.devModeEnabled == YES)
    {
        NSLog(@"Option click");
        
        if(self.devModeEnabled == YES)
            [menu addItemWithTitle:@"Go to Development Portal" action:@selector(openPortalClick:) keyEquivalent:@"g"];
        else
            [menu addItemWithTitle:@"Go to Portal" action:@selector(openPortalClick:) keyEquivalent:@"g"];
        
        [menu addItem:[NSMenuItem separatorItem]];
        
        NSMenuItem *portalPortMenuItem = [[NSMenuItem alloc] init];
        portalPortMenuItem.title = [NSString stringWithFormat:@"Portal proxy running on port %d", [self portalPort]];
        portalPortMenuItem.enabled = NO;
        
        NSMenuItem *corsProxyPortMenuItem = [[NSMenuItem alloc] init];
        corsProxyPortMenuItem.title = [NSString stringWithFormat:@"CORS proxy running on port %d", [self corsProxyPort]];
        corsProxyPortMenuItem.enabled = NO;
                                          
        NSMenuItem *corePortMenuItem = [[NSMenuItem alloc] init];
        corePortMenuItem.title = @"Core node running on port 6270";
        corePortMenuItem.enabled = NO;
        
        [menu addItem:portalPortMenuItem];
        [menu addItem:corsProxyPortMenuItem];
        [menu addItem:corePortMenuItem];
        [menu addItem:[NSMenuItem separatorItem]];
        
        NSMenuItem *devModeStatusMenuItem = [[NSMenuItem alloc] init];
        devModeStatusMenuItem.title = [NSString stringWithFormat:@"Portal Development Mode: %@", self.devModeEnabled ? @"Enabled" : @"Disabled"];
        devModeStatusMenuItem.enabled = NO;
        
        [menu addItem:devModeStatusMenuItem];
        
        [menu addItemWithTitle:[NSString stringWithFormat:@"%@ Portal Development Mode", self.devModeEnabled ? @"Disable" : @"Enable"] action:@selector(devModeClick:) keyEquivalent:@"d"];
        
        [menu addItem:[NSMenuItem separatorItem]];
    } else {
        [menu addItemWithTitle:@"Go to Portal" action:@selector(openPortalClick:) keyEquivalent:@"g"];
        [menu addItem:[NSMenuItem separatorItem]];
    }
    
    [menu addItemWithTitle:@"Turn Off Blockstack" action:@selector(exitClick:) keyEquivalent:@"q"];
    [self.statusItem popUpStatusItemMenu:menu];
}

- (void)devModeClick:(id)sender
{
    NSLog(@"devModeClick");
    self.devModeEnabled = !self.devModeEnabled;
}

- (void)openPortalClick:(id)sender
{
    NSLog(@"openPortalClick");
    [self launchBrowser];
}

- (void)exitClick:(id)sender
{
    NSLog(@"exitClick");
    
    NSAlert *alert = [[NSAlert alloc] init];
    [alert addButtonWithTitle:@"Turn off"];
    [alert addButtonWithTitle:@"Cancel"];
    [alert setMessageText:@"Turn off Blockstack?"];
    [alert setInformativeText:@"You will not be able to access the decentralized internet if you turn off Blockstack."];
    [alert setAlertStyle:NSAlertStyleWarning];
    
    if ([alert runModal] == NSAlertFirstButtonReturn) {
    
        [self.blockstackProxyTask terminate];
        NSLog(@"Blockstack Portal proxy terminated");
        
        [self.corsProxyTask terminate];
        NSLog(@"CORS proxy terminated");
        
        // Remove the icon from the menu bar
        [[NSStatusBar systemStatusBar] removeStatusItem:self.statusItem];
        
        [self stopBlockstackCoreApiAndExit];

    }

}

- (void)launchBrowser
{
    [self launchBrowser:NULL];
}
- (void)launchBrowser:(NSString*)path
{
    if(path == NULL)
        path = @"/";
    
    NSURL *portalURL = [NSURL URLWithString:[NSString stringWithFormat:@"%@%@", [self portalBaseUrl], path]];
    NSLog(@"Opening portal: %@", portalURL);
    [[NSWorkspace sharedWorkspace] openURL:portalURL];
}

- (void)startBlockstackProxy
{
    NSBundle*mainBundle=[NSBundle mainBundle];
    NSString*path=[mainBundle pathForResource:@"blockstackProxy" ofType:@""];
    NSLog(@"%@",path);
    NSString*browserPath=[mainBundle pathForResource:@"browser" ofType:@""];
    NSLog(@"Browser Path: %@",browserPath);
    
    
    self.blockstackProxyTask = [[NSTask alloc] init];
    self.blockstackProxyTask.launchPath = path;
    
    self.blockstackProxyTask.arguments = @[[NSString stringWithFormat:@"%d", self.prodModePortalPort], browserPath];

    NSLog(@"Starting Blockstack Portal proxy...");
    
    [self.blockstackProxyTask launch];

}

- (void)startCorsProxy
{
    NSBundle*mainBundle=[NSBundle mainBundle];
    NSString*path=[mainBundle pathForResource:@"corsproxy" ofType:@""];
    NSLog(@"CORS proxy path: %@",path);
    
    
    self.corsProxyTask = [[NSTask alloc] init];
    self.corsProxyTask.launchPath = path;

    NSLog(@"Starting CORS proxy...");
    
    [self.corsProxyTask launch];
}

- (void)startBlockstackCoreApiwithCoreWalletPassword:(NSString*)coreWalletPassword
{
    NSBundle*mainBundle=[NSBundle mainBundle];
    
    NSString*archivePath=[mainBundle pathForResource:@"blockstack-venv.tar" ofType:@"gz"];
    NSLog(@"Blockstack Virtualenv archive path: %@", archivePath);
    
    
    
    //NSString *extractToPath = [self blockstackDataPath];
    NSString* extractToPath = @"/tmp";
    NSLog(@"Extract Blockstack venv to: %@", extractToPath);
    
    self.blockstackCoreConfigFilePath = [NSString stringWithFormat:@"%@/config/client.ini", [self blockstackDataPath]];
    NSLog(@"Blockstack Core config file path: %@", self.blockstackCoreConfigFilePath);
    
    NSString* blockstackVenvPath = [NSString stringWithFormat:@"%@/blockstack-venv", extractToPath];
    NSLog(@"Blockstack Virtualenv Path: %@", blockstackVenvPath);

    self.blockstackPath = [NSString stringWithFormat:@"%@/bin/blockstack", blockstackVenvPath];
    NSLog(@"Blockstack Path: %@", blockstackPath);

    NSTask *extractTask = [[NSTask alloc] init];
    NSTask* blockstackCoreApiSetupTask = [[NSTask alloc] init];
    NSTask* blockstackCoreApiStartTask = [[NSTask alloc] init];
    
    
    
    /* Extract Blockstack Core virtualenv task */
    
    extractTask.launchPath = @"/usr/bin/tar";
    extractTask.arguments = @[@"-xvzf", archivePath, @"-C", extractToPath];

    NSPipe *pipe = [[NSPipe alloc] init];
    [extractTask setStandardOutput:pipe];
    [extractTask setStandardError:pipe];
    
    [[extractTask.standardOutput fileHandleForReading] setReadabilityHandler:^(NSFileHandle *file) {
        NSData *data = [file availableData]; // this reads to EOF
        NSLog(@"tar extraction output: %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
        
    }];
    
    extractTask.terminationHandler = ^(NSTask *aTask){
        NSLog(@"Finished extraction!");
        NSLog(@"Setting up Blockstack Core...");
        
        [blockstackCoreApiSetupTask launch];
        
    };
    
    /* Blockstack Core setup task */
    
    blockstackCoreApiSetupTask.launchPath = blockstackPath;
    
    blockstackCoreApiSetupTask.arguments = @[@"--debug", @"-y", @"--config", self.blockstackCoreConfigFilePath, @"setup", @"--password", coreWalletPassword];

    NSPipe *setupPipe = [[NSPipe alloc] init];
    [blockstackCoreApiSetupTask setStandardOutput:setupPipe];
    [blockstackCoreApiSetupTask setStandardError:setupPipe];
    
    [[blockstackCoreApiSetupTask.standardOutput fileHandleForReading] setReadabilityHandler:^(NSFileHandle *file) {
        NSData *data = [file availableData]; // this reads to EOF
        NSLog(@"Blockstack Core setup output: %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
        
    }];

    blockstackCoreApiSetupTask.terminationHandler = ^(NSTask *aTask){
        NSLog(@"Finished Blockstack Core setup!");
        NSLog(@"Starting Blockstack Core API endpoint...");
        [blockstackCoreApiStartTask launch];
    };
    

    /* Blockstack Core api start task */
    
    
    blockstackCoreApiStartTask.launchPath = self.blockstackPath;
    
    blockstackCoreApiStartTask.arguments = @[@"--debug", @"-y", @"--config", self.blockstackCoreConfigFilePath, @"api", @"start", @"--password", coreWalletPassword];
    
    NSPipe *startPipe = [[NSPipe alloc] init];
    [blockstackCoreApiStartTask setStandardOutput:startPipe];
    [blockstackCoreApiStartTask setStandardError:startPipe];
    
    [[blockstackCoreApiStartTask.standardOutput fileHandleForReading] setReadabilityHandler:^(NSFileHandle *file) {
        NSData *data = [file availableData]; // this reads to EOF
        NSLog(@"Blockstack Core api start output: %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
        
    }];
    
    blockstackCoreApiStartTask.terminationHandler = ^(NSTask *aTask){
        NSLog(@"Blockstack Core api started!");
    
    };
    
    
    [extractTask launch];
}

-(void)stopBlockstackCoreApiAndExit
{
    NSLog(@"Attempting to stop Blockstack Core API before exiting...");
    
    
    NSTask* blockstackCoreApiStopTask = [[NSTask alloc] init];
    
    blockstackCoreApiStopTask.launchPath = self.blockstackPath;
    
    blockstackCoreApiStopTask.arguments = @[@"--debug", @"-y", @"--config", self.blockstackCoreConfigFilePath, @"api", @"stop"];
    
    NSPipe *pipe = [[NSPipe alloc] init];
    [blockstackCoreApiStopTask setStandardOutput:pipe];
    [blockstackCoreApiStopTask setStandardError:pipe];
    
    [[blockstackCoreApiStopTask.standardOutput fileHandleForReading] setReadabilityHandler:^(NSFileHandle *file) {
        NSData *data = [file availableData]; // this reads to EOF
        NSLog(@"Blockstack Core api stop task output: %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
        
    }];
    
    blockstackCoreApiStopTask.terminationHandler = ^(NSTask *aTask){
        NSLog(@"Blockstack Core api stopped.");
        
        
        NSLog(@"Goodbye!");
        exit(0);
    };
    
    [blockstackCoreApiStopTask launch];
    
}

-(NSString*)blockstackDataPath
{
    NSLog(@"NSHomeDirectory(): %@", NSHomeDirectory());
    NSString* blockstackDataPath = [NSString stringWithFormat:@"%@/Library/Application Support/Blockstack",NSHomeDirectory()];
    
 
    NSFileManager* fileManager = [NSFileManager defaultManager];
    [fileManager createDirectoryAtPath:blockstackDataPath withIntermediateDirectories:YES attributes:nil error:nil];


    return blockstackDataPath;
}

/* Keychain management of Blockstack Core wallet password */



-(NSString*)createOrRetrieveCoreWalletPassword
{
    NSString* service = [self serviceName];
    NSString* account = [self accountName];
    
    UInt32 pwLength = 0;
    void* pwData = NULL;
    SecKeychainItemRef itemRef = NULL;
    
    OSStatus status = SecKeychainFindGenericPassword(
                                                     NULL,         // Search default keychains
                                                     (UInt32)service.length,
                                                     [service UTF8String],
                                                     (UInt32)account.length,
                                                     [account UTF8String],
                                                     &pwLength,
                                                     &pwData,
                                                     &itemRef      // Get a reference this time
                                                     );
    
    if (status == errSecSuccess) {
        NSData* data = [NSData dataWithBytes:pwData length:pwLength];
        NSString* password = [[NSString alloc] initWithData:data
                                                   encoding:NSUTF8StringEncoding];
        NSLog(@"Blockstack Core wallet password found in keychain");
        
        if (pwData) SecKeychainItemFreeContent(NULL, pwData);  // Free memory
        
        return password;
    } else {
        NSLog(@"Blockstack Core wallet password not found in keychain: %@", SecCopyErrorMessageString(status, NULL));
        
        if (pwData) SecKeychainItemFreeContent(NULL, pwData);  // Free memory
        
        return [self createAndStorePasswordInKeychain];
    }
}

-(NSString*)createAndStorePasswordInKeychain
{
    
    NSString* service = [self serviceName];
    NSString* account = [self accountName];
    NSString* password = [self generatePassword];
    const void* passwordData = [[password dataUsingEncoding:NSUTF8StringEncoding] bytes];
    
    OSStatus status = SecKeychainAddGenericPassword(
                                                    NULL,        // Use default keychain
                                                    (UInt32)service.length,
                                                    [service UTF8String],
                                                    (UInt32)account.length,
                                                    [account UTF8String],
                                                    (UInt32)password.length,
                                                    passwordData,
                                                    NULL         // Uninterested in item reference
                                                    );
    
    if (status != errSecSuccess) {     // Always check the status
        NSLog(@"Problem storing Blockstack Core wallet password to Keychain %@", SecCopyErrorMessageString(status, NULL));
    }
    return password;
}


-(NSString*)generatePassword
{
    // this isn't necessarily secure or random, but good enough for our purposes.
    NSString* password = [[NSProcessInfo processInfo] globallyUniqueString];
    return password;
}

-(NSString*)serviceName
{
    return @"blockstack-core-wallet-password";
}

-(NSString*)accountName
{
    return @"blockstack-core";
}

-(int)portalPort
{
    return self.devModeEnabled ? self.devModePortalPort : self.prodModePortalPort;
}

-(NSString*)portalBaseUrl
{
    return [NSString stringWithFormat:@"http://localhost:%d", [self portalPort]];
}

-(NSString*) portalAuthPath
{
    return @"/auth?authRequest=";
}

@end
