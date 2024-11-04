import { Config } from "../../../../types";

export const layout = (props: Config) => {
    return `import { Providers } from "./providers";
import Header from "./components/header";
import Footer from "./components/footer";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "${props.appName}",
    description: "build with Next.js and Tailwind CSS",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}
            >
                <Providers>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-grow bg-gray-100 p-8">
                            <div className="container mx-auto">{children}</div>
                        </main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}`;
};
export default layout;