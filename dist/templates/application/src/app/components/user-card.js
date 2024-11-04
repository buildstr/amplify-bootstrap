export const userCard = (props) => {
    return `"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
    Avatar,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Skeleton,
} from "@nextui-org/react";
import { AuthUser } from "../lib/types";

const UserCard = () => {
    const { data: session, status } = useSession();
    const [sessionIsLoaded, setSessionIsLoaded] = useState(false);
    useEffect(() => {
        if (status === "loading") {
            setSessionIsLoaded(false);
        } else {
            setSessionIsLoaded(true);
        }
    }, [status]);
    return (
        <div>
            <Card className="max-w-[400px]">
                <Skeleton isLoaded={sessionIsLoaded}>
                    <CardHeader className="flex gap-3">
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
                        <div className="flex flex-col">
                            <p className="text-md">{session?.user?.email}</p>
                            <p className="text-small text-default-500">
                                {(session?.user as AuthUser)?.groups[0]}
                            </p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <p>UserName: {session?.user?.name}</p>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        Repo Config: ${props.githubRepo}
                    </CardFooter>
                </Skeleton>
            </Card>
        </div>
    );
};

export default UserCard;
`;
};
export default userCard;
