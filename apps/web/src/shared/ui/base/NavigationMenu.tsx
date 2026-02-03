import {
  NavigationMenu as BaseNavigationMenu,
  NavigationMenuContent as BaseNavigationMenuContent,
  NavigationMenuIndicator as BaseNavigationMenuIndicator,
  NavigationMenuItem as BaseNavigationMenuItem,
  NavigationMenuLink as BaseNavigationMenuLink,
  NavigationMenuList as BaseNavigationMenuList,
  NavigationMenuTrigger as BaseNavigationMenuTrigger,
  NavigationMenuViewport as BaseNavigationMenuViewport,
  navigationMenuTriggerStyle,
} from '@repo/ui/shadcn';

export function NavigationMenu({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenu>) {
  return (
    <BaseNavigationMenu
      ref={ref}
      className={className}
      {...props}
      viewport={false}
    />
  );
}

export function NavigationMenuList({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenuList>) {
  return <BaseNavigationMenuList ref={ref} className={className} {...props} />;
}

export function NavigationMenuItem({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenuItem>) {
  return <BaseNavigationMenuItem ref={ref} className={className} {...props} />;
}

export function NavigationMenuTrigger({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenuTrigger>) {
  return (
    <BaseNavigationMenuTrigger ref={ref} className={className} {...props} />
  );
}

export function NavigationMenuContent({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenuContent>) {
  return (
    <BaseNavigationMenuContent ref={ref} className={className} {...props} />
  );
}

export function NavigationMenuLink({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenuLink>) {
  return <BaseNavigationMenuLink ref={ref} className={className} {...props} />;
}

export function NavigationMenuViewport({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenuViewport>) {
  return (
    <BaseNavigationMenuViewport ref={ref} className={className} {...props} />
  );
}

export function NavigationMenuIndicator({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof BaseNavigationMenuIndicator>) {
  return (
    <BaseNavigationMenuIndicator ref={ref} className={className} {...props} />
  );
}

export { navigationMenuTriggerStyle };
