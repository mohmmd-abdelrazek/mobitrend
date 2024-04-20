"use client";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import { Link } from "@/src/navigation";
import { useAuth } from "@/src/services/queries";
import { HomeTextProps } from "@/src/types/textProps";

const HomeClient = (texts: HomeTextProps) => {
  const { data, isLoading, error } = useAuth();
  if (isLoading) return <LoadingIndicator />;
  if (error) return <div>Failed to load</div>;

  return (
    <main className="flex h-full w-full flex-1 flex-col items-center justify-center gap-3 text-center">
      {data?.isAuthenticated ? (
        <>
          <h2 className="mb-4 text-4xl">
            {texts.homeGreeting} {data.user.name}
          </h2>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/create"
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              {texts.createPage}
            </Link>
            <Link
              href="/my-leagues"
              className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            >
              {texts.myPages}
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-6xl font-bold">
            {texts.join} <span className="text-blue-600">{texts.league}</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signin"
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
              {texts.signIn}
            </Link>
            <Link
              href="/signup"
              className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
            >
              {texts.signUp}
            </Link>
          </div>
        </>
      )}

      <p className="mt-3 text-2xl">
        {data?.isAuthenticated
          ? `${texts.startCreating}`
          : `${texts.signInToCreate}`}
      </p>
      <p className="text-lg text-gray-600">{texts.easyManage}</p>
    </main>
  );
};

export default HomeClient;
