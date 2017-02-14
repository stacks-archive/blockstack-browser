#import "MenubarController.h"
#import "StatusItemView.h"

@implementation MenubarController

@synthesize statusItemView = _statusItemView;


- (id)init
{
    self = [super init];
    if (self != nil)
    {
        // Install status item into the menu bar
        NSStatusItem *statusItem = [[NSStatusBar systemStatusBar] statusItemWithLength:STATUS_ITEM_VIEW_WIDTH];
        _statusItemView = [[StatusItemView alloc] initWithStatusItem:statusItem];
        _statusItemView.image = [NSImage imageNamed:@"MenuBar"];
        _statusItemView.action = @selector(handleClick:);
    }
    return self;
}

- (void)dealloc
{
    [[NSStatusBar systemStatusBar] removeStatusItem:self.statusItem];
}


- (NSStatusItem *)statusItem
{
    return self.statusItemView.statusItem;
}



@end
