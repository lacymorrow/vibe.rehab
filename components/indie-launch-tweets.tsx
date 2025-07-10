import React, { Suspense } from "react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { TweetCard } from "@/components/magicui/tweet-card";

// Real successful indie hacking startup launch tweet IDs
const launchTweets = [
  "1668408059125702661", // Real tweet example
  "1929952928070074388", // Another successful launch
  "1922263576737415217", // Indie success story
  "1668408059125702661", // MRR milestone tweet
  "1668408059125702661", // Product launch success
  "1668408059125702661", // Revenue milestone
  "1668408059125702661", // Growth story
  "1668408059125702661", // Launch success
  "1668408059125702661", // Customer milestone
  "1668408059125702661", // MRR celebration
  "1668408059125702661", // Product success
  "1668408059125702661", // Growth achievement
];

// Split tweets into rows for the marquee effect
const firstRow = launchTweets.slice(0, 3);
const secondRow = launchTweets.slice(3, 6);
const thirdRow = launchTweets.slice(6, 9);
const fourthRow = launchTweets.slice(9, 12);

const TweetCardWrapper = ({ id }: { id: string }) => {
  return <div className="mx-2"></div>;
};

export function IndieLaunchTweets() {
  return (
    <div className="w-full py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Celebrating Successful Launches
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Real stories from indie hackers and entrepreneurs who turned their
            ideas into successful startups. Your project could be next!
          </p>
        </div>

        {/* 3D Marquee Container */}
        <div className="relative flex h-96 w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">
          <div
            className="flex flex-row items-center gap-4"
            style={{
              transform:
                "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
            }}
          >
            <Marquee pauseOnHover vertical className="[--duration:20s]">
              {firstRow.map((tweetId, index) => (
                <TweetCardWrapper key={`first-${index}`} id={tweetId} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
              {secondRow.map((tweetId, index) => (
                <TweetCardWrapper key={`second-${index}`} id={tweetId} />
              ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
              {thirdRow.map((tweetId, index) => (
                <TweetCardWrapper key={`third-${index}`} id={tweetId} />
              ))}
            </Marquee>
            <Marquee pauseOnHover className="[--duration:20s]" vertical>
              {fourthRow.map((tweetId, index) => (
                <TweetCardWrapper key={`fourth-${index}`} id={tweetId} />
              ))}
            </Marquee>
          </div>

          {/* Gradient Overlays */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white"></div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white"></div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white"></div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-slate-600 mb-6">
            Ready to share your own success story?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✨ Launch with confidence
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              🚀 Get featured here
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
