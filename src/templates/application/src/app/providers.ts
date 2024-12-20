import { Config } from '../../../../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const providers = (props: Config) => {
    return `"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <SessionProvider>
            <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
        </SessionProvider>
    );
}`;
};
export default providers;
