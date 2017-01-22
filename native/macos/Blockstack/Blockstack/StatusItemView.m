#import "StatusItemView.h"

@implementation StatusItemView

@synthesize statusItem = _statusItem;
@synthesize image = _image;
@synthesize action = _action;
@synthesize target = _target;

- (id)initWithStatusItem:(NSStatusItem *)statusItem
{
    CGFloat itemWidth = [statusItem length];
    CGFloat itemHeight = [[NSStatusBar systemStatusBar] thickness];
    NSRect itemRect = NSMakeRect(0.0, 0.0, itemWidth, itemHeight);
    self = [super initWithFrame:itemRect];
    
    if (self != nil) {
        _statusItem = statusItem;
        _statusItem.view = self;
    }
    return self;
}



- (void)drawRect:(NSRect)dirtyRect
{
	// Support dark mode
    if ([[[NSUserDefaults standardUserDefaults] stringForKey:@"AppleInterfaceStyle"]  isEqual: @"Dark"])
    {
        self.image = [NSImage imageNamed:@"MenuBarDark"];
    }
    else
    {
            self.image = [NSImage imageNamed:@"MenuBar"];
    }
	[self.statusItem drawStatusBarBackgroundInRect:dirtyRect withHighlight:NO];
    
    NSImage *icon = self.image;
    NSSize iconSize = [icon size];
    NSRect bounds = self.bounds;
    CGFloat iconY = roundf((NSHeight(bounds) - iconSize.height) / 2);
    CGFloat iconX = roundf((NSWidth(bounds) - iconSize.width) / 2);
    NSPoint iconPoint = NSMakePoint(iconX, iconY);

	[icon drawAtPoint:iconPoint fromRect:NSZeroRect operation:NSCompositingOperationSourceOver fraction:1.0];
}


- (void)mouseDown:(NSEvent *)theEvent
{
    [NSApp sendAction:self.action to:self.target from:self];
}



- (void)setImage:(NSImage *)newImage
{
    if (_image != newImage) {
        _image = newImage;
        [self setNeedsDisplay:YES];
    }
}


- (NSRect)globalRect
{
    NSRect frame = [self frame];
    return [self.window convertRectToScreen:frame];
}
@end
