
import * as React from "react";
 
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuRight,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const LoginForm = () => {
  return (
    <form className="flex flex-col space-y-4 p-3">
      <div className="flex flex-col">
        <label htmlFor="username" className="text-sm font-medium text-muted-foreground mb-1">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="p-2 border rounded-md focus:outline-none focus:ring focus:border-primary"
          placeholder="Enter your username"
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="password" className="text-sm font-medium text-muted-foreground mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="p-2 border rounded-md focus:outline-none focus:ring focus:border-primary"
          placeholder="Enter your password"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white p-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring focus:border-primary-dark"
      >
        Login
      </button>
    </form>
  )
}

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]
 
export default function Navbar({navbarColor}: {navbarColor: string}) {
  return (
    <div className={`navbar sticky top-0 z-40 w-full backdrop-blur-sm flex transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] supports-backdrop-blur:bg-white/60 dark:bg-transparent`}
    style={{
      backgroundColor: navbarColor,
    }}>
      <div className="left flex justify-start w-1/3">
        <NavigationMenu className="dark">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Brown Puzzlehunt</NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          shadcn/ui
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Beautifully designed components built with Radix UI and
                          Tailwind CSS.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs" title="Introduction">
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>
                  <ListItem href="/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem href="/docs/primitives/typography" title="Typography">
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="middle flex justify-center text-white w-1/3"></div>
      <div className="right flex justify-end text-white w-1/3">
        <NavigationMenuRight className="dark">
          <NavigationMenuList>
            <NavigationMenuItem>
              REGISTER
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>LOGIN</NavigationMenuTrigger>
              <NavigationMenuContent>
                <LoginForm/>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenuRight>
      </div>
    </div>
  )
}
 
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"