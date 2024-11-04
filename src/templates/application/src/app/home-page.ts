import { Config } from "../../../../types";

export const homePage = (props: Config) => {
    return `import UserCard from "@/app/components/user-card";
import FetchCard from "@/app/components/fetch-card";
export default async function Home() {
  return (
    <div className="flex space-x-4">
      <span className="">
      <UserCard />
      </span>
      <span className="">
      <FetchCard />
      </span>
    </div>
  );
}`;
};
export default homePage;
