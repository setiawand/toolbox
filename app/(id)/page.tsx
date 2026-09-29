import HomePage from "@/components/HomePage";
import { homeMetadata } from "@/lib/metadata";

export const metadata = homeMetadata("id");

export default function Page() {
  return <HomePage lang="id" />;
}
