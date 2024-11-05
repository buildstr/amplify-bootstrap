import { Config } from '../../../../../types';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const types = (props: Config) => {
    return `export interface AuthUser {
    name: string;
    email: string;
    groups: string[];
    org_name: string;
    user_type: "admin" | "viewer";
    user_id?: number;
    accounts?: { [key: string]: string }[];
    roles?: string[];
  }`;
};
export default types;
