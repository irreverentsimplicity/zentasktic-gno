import Image from "next/image";
import Footer from "./components/Footer";
import './globals.css';

export default function Home() {
  const coreDescription = "The unopinionated, basic version of the Assess - Decide - Do productivity workflow. Implemented as a package that can be instantiated and called from a realm."
  const projectDescription = "The opinionated implementation, enriched with other data types, such as Actor, Team and Workable hours. Deployed as a realm package."
  const userDescription = "A simple implementation, aimed at a single user, for managing personal workflows. Deployed as a realm package."
  return (
    <main className="flex flex-col min-h-screen items-center justify-between bg-gradient-to-tr from-blue-500 to-blue-900 text-white p-10">
      <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/zentasktic-logo.png"
          alt="ZenTasktic"
          width={180}
          height={180}
          priority
        />
      <div className="flex flex-1 items-center justify-start">
        <h1 className="text-[6vw] font-semibold leading-none text-center text-shadow-lg">
          ZenTasktic on Gno
        </h1>
      </div>
      
      <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center content-start">
      
        {createLinkCard("/core", "Core", coreDescription, "in development", "alpha")}
        {createLinkCard("/project", "Project", projectDescription, "in development", "alpha")}
        {createLinkCard("/user", "User", userDescription, "in development", "alpha")}
      </div>

      <Footer />
    </main>
  );
}

// Helper function to create link card
function createLinkCard(url, title, description, status, access) {
  return (
    <a href={url} className="group rounded-lg border bg-blue-900 border-transparent px-5 py-4 mx-1 transition-colors hover:border-gray-300 hover:bg-green-700 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
      <h2 className="mb-3 text-2xl font-bold">
        {title}
      </h2>
      <p className="m-0 max-w-[33ch] text-sm">
        <u>About:</u> {description}
      </p>
      <p className="m-0 max-w-[33ch] text-sm">
        <u>Status:</u> {status}
      </p>
      <p className="m-0 max-w-[33ch] text-sm">
        <u>Access:</u> {access}
      </p>
    </a>
  );
}

