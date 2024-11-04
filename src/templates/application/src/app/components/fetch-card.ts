import { Config } from "../../../../../types";

export const fetchCard = (props: Config) => {
    return `"use client";
import { Divider, Skeleton } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
export default function FetchCard() {
    interface Info {
        text: string;
        number: number;
        found: boolean;
        type: string;
    }

    const [info, setInfo] = useState<Info>();
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        async function fetchPosts() {
            const random = Math.floor(Math.random() * 100);
            let res = await fetch(\`/api/fetch-test/\${random}\`);
            let data = await res.json();
            setInfo(data);
            setLoaded(true);
        }
        fetchPosts();
    }, []);
    return (
        <Skeleton isLoaded={loaded}>
            {info && (
                <Card>
                    <CardHeader>
                        <h1>{info.number} Info</h1>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <p>{info.text}</p>
                    </CardBody>
                    <Divider />
                    <CardFooter>
                        <p>{info.found ? "Found" : "Not Found"} - {info.type}</p>
                    </CardFooter>
                </Card>
            )}
        </Skeleton>
    );
}
`;
};
export default fetchCard;