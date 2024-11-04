export const header = (props) => {
    return `"use client";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    DropdownItem,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    Avatar,
    Skeleton,
    Button,
} from "@nextui-org/react";
import { useSession, signOut } from "next-auth/react";

import { Logo } from "./logo";
import { useEffect, useState } from "react";
export default function Header() {
    const { data: session, status } = useSession();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [sessionIsLoaded, setSessionIsLoaded] = useState(false);

    useEffect(() => {
        if (status === "loading") {
            setIsLoggedIn(false);
            setSessionIsLoaded(false);
        } else if (status === "authenticated") {
            setIsLoggedIn(true);
            setSessionIsLoaded(true);
            console.log("Session is authenticated");
        } else {
            setIsLoggedIn(false);
            setSessionIsLoaded(true);
            console.log("Session is not authenticated");
        }
    }, [status]);

    return (
        <div>
            <Navbar maxWidth="full">
                <NavbarContent justify="start">
                    <NavbarBrand>
                        <Logo />
                        <span className="font-bold text-inherit ml-2">
                            ${props.appName}
                        </span>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent justify="center">
                    <NavbarItem>
                        <Link href="/">Home</Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link href="/login">Login</Link>
                    </NavbarItem>
                </NavbarContent>

                <NavbarContent justify="end">
                    <Skeleton isLoaded={sessionIsLoaded}>
                        {isLoggedIn ? (
                            <Dropdown>
                                <DropdownTrigger>
                                    <Avatar
                                        isBordered
                                        as="button"
                                        className="transition-transform"
                                        color="secondary"
                                        name={session?.user?.name || "User"}
                                        size="sm"
                                        src={
                                            session?.user?.image ||
                                            "/image/default-avatar.png"
                                        }
                                    />
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="Profile Actions"
                                    variant="flat"
                                >
                                    <DropdownItem
                                        key="profile"
                                        className="h-14 gap-2"
                                        textValue="signed_in_as"
                                    >
                                        <p className="font-semibold">
                                            Signed in as
                                        </p>
                                        <p className="font-semibold">
                                            {session?.user?.email}
                                        </p>
                                    </DropdownItem>
                                    <DropdownItem
                                        key="settings"
                                        textValue="my_settings"
                                    >
                                        My Settings
                                    </DropdownItem>
                                    <DropdownItem
                                        key="team_settings"
                                        textValue="team_settings"
                                    >
                                        Team Settings
                                    </DropdownItem>
                                    <DropdownItem
                                        key="analytics"
                                        textValue="analytics"
                                    >
                                        Analytics
                                    </DropdownItem>
                                    <DropdownItem
                                        key="system"
                                        textValue="system"
                                    >
                                        System
                                    </DropdownItem>
                                    <DropdownItem
                                        key="configurations"
                                        textValue="configurations"
                                    >
                                        Configurations
                                    </DropdownItem>
                                    <DropdownItem
                                        key="help_and_feedback"
                                        textValue="help_and_feedback"
                                    >
                                        Help & Feedback
                                    </DropdownItem>
                                    <DropdownItem>
                                        <Button
                                            key="logout"
                                            onClick={() =>
                                                signOut({
                                                    callbackUrl:
                                                        process.env
                                                            .NEXTAUTH_URL,
                                                })
                                            }
                                        >
                                            Log Out
                                        </Button>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        ) : (
                            <NavbarItem>
                                <Link color="foreground" href="/login">
                                    Login
                                </Link>
                            </NavbarItem>
                        )}
                    </Skeleton>
                </NavbarContent>
            </Navbar>
        </div>
    );
}
`;
};
export default header;
