import React from "react";
import Post from "./Post";
import Spinner from "./Spinner";
import { useState } from "react";

function Theme({
  theme,
  index,
  themes,
  setThemes,
  generatePostIdeas,
  generatePost,
  setPost,
}) {
  const [inputValue, setInputValue] = useState("");

  return (
    <div
      className={`flex flex-col items-start justify-start ${index != 2 && ""} `}
      key={index}
    >
      <div className="flex w-full mb-3">
        <div className="relative w-full">
          <input
            type="text"
            value={inputValue}
            className={`p-2.5 w-full z-20 placeholder:text-md font-kumbh font-medium rounded-md border-[1.5px] border-vulseBorder focus:ring-vulsePurple focus:border-vulsePurple focus:outline-none ${
              inputValue && "text-[#0B1A52]"
            }`}
            placeholder={`Enter a theme to generate content`}
            onChange={(e) => {
              setInputValue(e.target.value);
              setThemes(
                themes.map((item, i) =>
                  i === index ? { ...item, theme: e.target.value } : item
                )
              );
            }}
          />
          {inputValue && (
            <button
              type="button"
              className="group/item transition-opacity duration-300 px-2 opacity-100 absolute top-[1px] right-[1.5px]  h-[95.5%]  text-sm font-medium rounded-r-lg bg-white"
              onClick={async () => {
                await generatePostIdeas(theme.theme, index);
              }}
            >
              {theme.loading ? (
                <Spinner />
              ) : (
                <svg
                  fill="none"
                  stroke="vulseGrey"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-5 h-5 transition duration-75"
                >
                  <path
                    className="stroke-gray-400 group-hover/item:stroke-vulseBlue transition-all ease-in-out duration-75 "
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="currentColor"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
      {theme.ideas && theme.ideas.length > 0 && (
        <div className="flex flex-col items-center justify-center rounded-md space-y-4 py-2 text-sm border-[1.5px] border-vulseBorder bg-white w-full">
          {theme.ideas.map((topic, index, arr) => (
            <div
              className={`flex flex-col items-center justify-between text-sm w-[97%] text-vulseBlue ${
                index !== arr.length - 1 ? "border-b-2 border-[#EAE8EF]" : ""
              }`}
              key={index}
            >
              <div
                className="flex items-center justify-between rounded space-x-2 text-sm w-full pb-1"
                key={index}
              >
                <h3 className="text-sm font-semibold text-gray-800">
                  {topic.title}
                </h3>
                <button
                  className={`ml-1 py-1 px-2 text-white bg-vulsePurple rounded-full`}
                  onClick={() => generatePost(topic.title, theme.theme)}
                >
                  {topic.loading ? <Spinner /> : "Generate"}
                </button>
              </div>
              {topic.post && <Post topic={topic} setPost={setPost} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Theme;
