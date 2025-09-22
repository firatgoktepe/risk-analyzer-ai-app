import { redirect } from "next/navigation";

// This redirects the root to the default locale (English)
export default function RootPage() {
  redirect("/en");
}
