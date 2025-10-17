"use client";

import { createUserOnServer, getUser } from "@/features/users/actions";
import { useUser } from "@clerk/nextjs";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  console.log("OnboardingClient rendered with userId:", userId, user);

  useEffect(() => {
    if (!isLoaded) return;

    const intervalId = setInterval(async () => {
      const userData = await getUser(userId);
      if (userData) {
        clearInterval(intervalId);
        router.replace("/app");
        return;
      }

      if (!user) return;

      // 🪄 Call the server action instead of direct db call
      await createUserOnServer({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress ?? "",
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        imageUrl: user.imageUrl ?? "",
        createdAt: new Date(user.createdAt ?? Date.now()),
        updatedAt: new Date(user.updatedAt ?? Date.now()),
      });
    }, 400);

    return () => {
      clearInterval(intervalId);
    };
  }, [userId, router, user, isLoaded]);

  return <Loader2Icon className="animate-spin size-24" />;
}
