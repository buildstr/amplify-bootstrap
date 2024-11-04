import { Config } from "../../types";
export const env = (props: Config) => {
    return `NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="B6+gBMa/hKdYOJGL/JNGUIQ0GvpjlZEWXEcHpSO+qlA="
`;
};
export default env;
