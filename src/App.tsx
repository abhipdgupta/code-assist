import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useState, lazy, Suspense } from "react";
import Settings from "./tabs/settings";

const OverviewTab = lazy(() => import("./tabs/overview"));
const VideoSolutionTab = lazy(() => import("./tabs/videoSolution"));
const BookmarksTab = lazy(() => import("./tabs/bookmarks"));
const NotesTab = lazy(() => import("./tabs/notes"));

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <main className="w-[400px] h-[600px] p-2 overscroll-auto bg-cyan-950 text-white relative  text-xs">
      <div className="p-2 bg-black  rounded-md overflow-auto w-full h-full">
        <Tabs
          selectedIndex={selectedIndex}
          onSelect={(index) => setSelectedIndex(index)}
        >
          <TabList className="flex justify-around items-center ">
            <Tab
              className={`cursor-pointer px-2 py-1 rounded-md ${
                selectedIndex === 0 && "bg-gray-700 "
              }`}
            >
              About
            </Tab>
            <Tab
              className={`cursor-pointer px-2 py-1 rounded-md ${
                selectedIndex === 1 && "bg-gray-700 "
              }`}
            >
              Video Solution
            </Tab>
            <Tab
              className={`cursor-pointer px-2 py-1 rounded-md ${
                selectedIndex === 2 && "bg-gray-700 "
              }`}
            >
              Bookmarks
            </Tab>
            <Tab
              className={`cursor-pointer px-2 py-1 rounded-md ${
                selectedIndex === 3 && "bg-gray-700 "
              }`}
            >
              Notes
            </Tab>
            <Tab
              className={`cursor-pointer px-2 py-1 rounded-md ${
                selectedIndex === 4 && "bg-gray-700 "
              }`}
            >
              Settings
            </Tab>
          </TabList>

          <Suspense fallback={<div>Loading...</div>}>
            <TabPanel>
              <OverviewTab />
            </TabPanel>

            <TabPanel>
              <VideoSolutionTab />
            </TabPanel>

            <TabPanel>
              <BookmarksTab />
            </TabPanel>
            <TabPanel>
              <NotesTab />
            </TabPanel>
            <TabPanel>
              <Settings />
            </TabPanel>
          </Suspense>
        </Tabs>
      </div>
    </main>
  );
}

export default App;
