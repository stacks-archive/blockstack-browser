#import "ApplicationDelegate.h"

@implementation ApplicationDelegate

@synthesize menubarController = _menubarController;
@synthesize blockstackProxyTask;
@synthesize corsProxyTask;
@synthesize mockBlockstackCoreApiTask;


- (void)dealloc
{
}



- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
    // Add our icon to menu bar
    self.menubarController = [[MenubarController alloc] init];
    
    [self startBlockstackProxy];
    [self startCorsProxy];
    [self startMockBlockstackCoreApi];
    
    [self performSelector:@selector(launchBrowser) withObject:self afterDelay:LAUNCH_BROWSER_DELAY];
    
}

- (NSApplicationTerminateReply)applicationShouldTerminate:(NSApplication *)sender
{
    // Explicitly remove the icon from the menu bar
    self.menubarController = nil;
    [self.blockstackProxyTask terminate];
    [self.corsProxyTask terminate];
    [self.mockBlockstackCoreApiTask terminate];
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
        
        [self.mockBlockstackCoreApiTask terminate];
        NSLog(@"mockBlockstackCoreApiTask server terminated");
        
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

- (void)startMockBlockstackCoreApi
{
    NSBundle*mainBundle=[NSBundle mainBundle];
    
    NSString*archivePath=[mainBundle pathForResource:@"blockstack-venv.tar" ofType:@"gz"];
    NSLog(@"Blockstack Virtualenv archive path: %@", archivePath);
    
    //NSArray *tokens = [archivePath componentsSeparatedByString:@"blockstack-venv.tar."];
    NSString *extractToPath = [self blockstackDataPath];
    NSLog(@"Extract Blockstack venv to: %@", extractToPath);

    NSString *blockstackVenvPath = [NSString stringWithFormat:@"%@/blockstack-venv", extractToPath];
    NSLog(@"Blockstack Virtualenv Path: %@", blockstackVenvPath);

    
    NSString *blockstackPath = [NSString stringWithFormat:@"\"%@/bin/python2.7\" \"%@/bin/blockstack\"", blockstackVenvPath, blockstackVenvPath];
    NSLog(@"Blockstack path: %@", blockstackPath);

    NSString*mockBlockstackCoreApiPath=[mainBundle pathForResource:@"mockBlockstackCoreApi" ofType:@""];
    NSLog(@"mockBlockstackCoreApi path: %@",mockBlockstackCoreApiPath);

    NSTask *extractTask = [[NSTask alloc] init];
    extractTask.launchPath = @"/usr/bin/tar";
    extractTask.arguments = @[@"-xvzf", archivePath, @"-C", extractToPath];

    
    NSPipe *pipe = [[NSPipe alloc] init];
    [extractTask setStandardOutput:pipe];
    [extractTask setStandardError:pipe];
    
    [[extractTask.standardOutput fileHandleForReading] setReadabilityHandler:^(NSFileHandle *file) {
        NSData *data = [file availableData]; // this reads to EOF
        NSLog(@"tar extraction output: %@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);
        
    }];
    
    self.mockBlockstackCoreApiTask = [[NSTask alloc] init];
    self.mockBlockstackCoreApiTask.launchPath = mockBlockstackCoreApiPath;
    
    self.mockBlockstackCoreApiTask.arguments = @[@"8889", blockstackPath];
    
    extractTask.terminationHandler = ^(NSTask *aTask){
        NSLog(@"Finished extraction!");
        NSLog(@"Starting mockBlockstackCoreApi server...");
        
        [self.mockBlockstackCoreApiTask launch];
        
    };
    
    [extractTask launch];
}

-(NSString*)blockstackDataPath
{
    NSLog(@"NSHomeDirectory(): %@", NSHomeDirectory());
    NSString* blockstackDataPath = [NSString stringWithFormat:@"%@/Library/Application Support/Blockstack",NSHomeDirectory()];
    
 
    NSFileManager* fileManager = [NSFileManager defaultManager];
    [fileManager createDirectoryAtPath:blockstackDataPath withIntermediateDirectories:YES attributes:nil error:nil];


    return blockstackDataPath;
}

@end
