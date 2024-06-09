import { Linkedin } from "lucide-react";

function OverviewTab() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-center">Code Assist</h1>
      <h3 className="text-sm font-semibold text-gray-400 text-center">
        (a{" "}
        <a
          href="https://leetcode.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline-offset-1 hover:underline"
        >
          LeetCode
        </a>{" "}
        extension)
      </h3>
      <p className="text-gray-300 mb-4">
        Boost your problem-solving coding experience with these features:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li className="text-gray-300">
          <span className="font-semibold">Get LeetCode YouTube Videos:</span>
          Instantly fetch relevant YouTube tutorials for any LeetCode problem.
        </li>
        <li className="text-gray-300">
          <span className="font-semibold">Question Bookmark:</span>
          Save your favorite questions for quick access later.
        </li>
        <li className="text-gray-300">
          <span className="font-semibold">Note-Taking Feature:</span>
          Keep a personal log of your notes for each problem you solve.
        </li>
        <li className="text-gray-300">
          <span className="font-semibold">Download PDF:</span> Export your Notes
          to a PDF for easy review and sharing.
        </li>
      </ul>
      <p className="text-gray-300 mt-4">
        Simplify your coding journey with Code Assist!
      </p>
      <div className="flex items-center justify-center mt-8">
        <img src="happy_coding.png" alt="Happy Coding" />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-center">
          About the Developer
        </h2>
        <div className="flex flex-col items-center mt-4">
          <p className="text-gray-300">Developed by Abhishek</p>
          <div className="flex space-x-4 mt-2">
            <a
              href="https://github.com/abhipdgupta"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-white justify-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-github"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/abhishek-prasad-gupta/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-300 hover:text-white justify-center gap-1"
            >
              <Linkedin />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default OverviewTab;
