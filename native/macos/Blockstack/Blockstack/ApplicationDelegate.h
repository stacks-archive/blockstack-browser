#define LAUNCH_BROWSER_DELAY 1.0


@interface ApplicationDelegate : NSObject <NSApplicationDelegate>

@property (nonatomic, strong) NSTask *blockstackProxyTask;
@property (nonatomic, strong) NSTask *corsProxyTask;

@property (strong) NSString *blockstackCoreConfigFilePath;

@property (strong) NSString *blockstackPath;

@property (strong) NSStatusItem *statusItem;

@property BOOL devModeEnabled;

@property (readonly) int prodModePortalPort;
@property (readonly) int devModePortalPort;
@property (readonly) int corsProxyPort;

@end
