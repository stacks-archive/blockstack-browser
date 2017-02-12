#define LAUNCH_BROWSER_DELAY 1.0

#import "MenubarController.h"

@interface ApplicationDelegate : NSObject <NSApplicationDelegate>

@property (nonatomic, strong) MenubarController *menubarController;
@property (nonatomic, strong) NSTask *blockstackProxyTask;
@property (nonatomic, strong) NSTask *corsProxyTask;

@property (strong) NSString *blockstackCoreConfigFilePath;

@property (strong) NSString *pythonPath;
@property (strong) NSString *blockstackPath;


- (IBAction)handleClick:(id)sender;

@end
