#import "ApplicationDelegate.h"

@implementation ApplicationDelegate

@synthesize menubarController = _menubarController;
@synthesize blockstackProxyTask;
@synthesize corsProxyTask;


- (void)dealloc
{
}



- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
    // Add our icon to menu bar
    self.menubarController = [[MenubarController alloc] init];
    
    [self startBlockstackProxy];
    [self startCorsProxy];
    
    [self performSelector:@selector(launchBrowser) withObject:self afterDelay:LAUNCH_BROWSER_DELAY];
    
}

- (NSApplicationTerminateReply)applicationShouldTerminate:(NSApplication *)sender
{
    // Explicitly remove the icon from the menu bar
    self.menubarController = nil;
    [self.blockstackProxyTask terminate];
    [self.corsProxyTask terminate];
    return NSTerminateNow;
}


- (IBAction)handleClick:(id)sender
{
    NSLog(@"handleClick");
    
    NSAlert *alert = [[NSAlert alloc] init];
    [alert addButtonWithTitle:@"Turn off"];
    [alert addButtonWithTitle:@"Cancel"];
    [alert setMessageText:@"Turn off Blockstack?"];
    [alert setInformativeText:@"You will not be able to access the decentralized internet if you turn off Blockstack."];
    [alert setAlertStyle:NSAlertStyleWarning];
    
    if ([alert runModal] == NSAlertFirstButtonReturn) {
    
        [self.blockstackProxyTask terminate];
        NSLog(@"Blockstack Browser proxy terminated");
        
        [self.corsProxyTask terminate];
        NSLog(@"CORS proxy terminated");
        
        // Remove the icon from the menu bar
        self.menubarController = nil;
        
        NSLog(@"Goodbye!");
        
        exit(0);
    }

}

- (void)launchBrowser
{
    [[NSWorkspace sharedWorkspace] openURL:[NSURL URLWithString:@"http://localhost:8888"]];
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
    
    self.blockstackProxyTask.arguments = @[@"8888", browserPath];

    NSLog(@"Starting Blockstack Browser proxy...");
    
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

@end
