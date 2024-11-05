import { Config } from '../../../../../../../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const nextAuth = (props: Config) => {
    return `import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth-options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
`;
};
export default nextAuth;
