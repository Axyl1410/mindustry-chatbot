import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <Empty className="flex h-screen w-full items-center justify-center">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for
          what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link
              href="https://github.com/Axyl1410/mindustry-chatbot/issues/new"
              rel="noopener noreferrer"
              target="_blank"
            >
              Contact support
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">Go to home</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
