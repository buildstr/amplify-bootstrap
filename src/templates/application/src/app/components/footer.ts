import { Config } from "../../../../../types";

export const footer = (props: Config) => {
    return `export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto text-center">
                <p>&copy; ${new Date().getFullYear()} ${props.appName}. All rights reserved.</p>
            </div>
        </footer>
    );
}`;
};
export default footer;
