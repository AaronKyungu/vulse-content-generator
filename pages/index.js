import { deleteCookie, getCookies } from "cookies-next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import languages from "../consts/languages";
import tones from "../consts/tones";
import { LINKEDIN_URL } from "../helpers/auth";
import MenuButton from "../components/MenuButton";
import PostEdit from "../components/PostEdit";
import Theme from "../components/Theme";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { LuClock3 } from "react-icons/lu";
import Link from "next/link";

export default function Home() {
  //main object to store all data
  const [themes, setThemes] = useState([
    {
      theme: "theme 1",
      loading: false,
    },
    {
      theme: "theme 2",
      loading: false,
    },
    {
      theme: "theme 3",
      loading: false,
    },
  ]);

  const [inputValue, setInputValue] = useState("");

  //editable in sidebar
  const [session, setSession] = useState(null); //user session from linkedin
  const [sidebarOpen, setSidebarOpen] = useState(false); //show sidebar
  const [model, setModel] = useState("gpt-4"); //model to use for gpt - speed(gpt-3.5-turbo)/quality(gpt-4)
  const [profiles, setProfiles] = useState({
    new: [{ content: "" }],
  }); //profiles fetched from linkedin - awaiting partner scope permissions 'r_member_social'
  const [profile, setProfile] = useState("new");
  const blankProfile = [{ content: "" }];
  const [posts, setPosts] = useState(blankProfile); //posts fetched from linkedin - awaiting partner scope permissions 'r_member_social'
  const [post, setPost] = useState(""); //selected generated post to edit in textarea
  const [tone, setTone] = useState("professional"); //tone to select from
  const [language, setLanguage] = useState("English"); //language to select from
  const [headline, setHeadline] = useState("Professional"); //user headline from linkedin
  const [sector, setSector] = useState("Web development"); //sector to select from - awaiting partner scope permissions 'r_member_social'
  const [bio, setBio] = useState("I am a digital handyman"); //user bio from linkedin - awaiting partner scope permissions 'r_member_social'

  //identity that takes headline from user profile
  const [promptIdentity, setPromptIdentity] = useState(
    `You are a ${headline} writing posts for your company profile on the social media platform: LinkedIn`
  );
  //set as state var to allow for user rule editing in future
  const [promptRules, setPromptRules] =
    useState(`The post MUST follow these rules:
  - The post should have a short opening sentence not more than 350 characters.
  - The opening sentence must be followed by a line break.
  - The post should be no more than 3000 characters.
  - Separate each sentence with a line break.
  - The post should be written in the third person.
  - The post should be written in the present tense.
  - There should be no more than 3 hashtags, these should be relevant to the post copy.
  - Hashtags should be at the end of the post`);
  const [promptTone, setPromptTone] = useState(`Posts should be ${tone}.`);
  const [promptLanguage, setPromptLanguage] = useState(
    `The language should be ${language}.`
  );
  const [promptHeadline, setPromptHeadline] = useState(
    `The users LinkedIn headline is: ${headline}.`
  );
  const [promptExample, setPromptExample] =
    useState(`An example of a previous post by the user is:
  -------
  ${
    posts
      ? posts
          ?.map((post, postIndex) => `Post ${postIndex}: ${post.content}`)
          .join("\n")
      : ""
  }
  -------`);
  const [promptStyle, setPromptStyle] = useState(
    `The style of the new post should be similar to the example.`
  );
  const [promptSubject, setPromptSubject] = useState(
    `The subject of the post is: ${themes[0].theme}.`
  );

  const [vulsePrompt, setVulsePrompt] = useState(``);

  const handleChangeTone = (e) => {
    setTone(e.target.value);
  };

  const handleChangeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const handleChangeHeadline = (e) => {
    setHeadline(e.target.value);
  };

  const handleChangePrompt = (e) => {
    setVulsePrompt(e.target.value);
  };

  useEffect(() => {
    // The users LinkedIn profile description is: {description}. <-- stripped out because we can't get bio
    // The user works in the {sector} industry. <-- stripped out because we can't get job history
    setVulsePrompt(`You are a ${headline} writing posts for your personal profile on the social media platform: LinkedIn
    The post MUST follow these rules:
    - The post should have a short opening sentence not more than 350 characters.
    - The opening sentence must be followed by a line break.
    - The post should be no more than 3000 characters.
    - Separate each sentence with a line break.
    - The post should be written in the third person.
    - The post should be written in the present tense.
    - There should be no more than 3 hashtags, these should be relevant to the post copy.
    - Hashtags should be at the end of the post
    Posts should be ${tone}.
    The language should be ${language}.

    The users LinkedIn headline is: ${headline}.

    An example of a previous post by the user is:
    -------
    ${posts ? posts?.map((post) => post.content).join("\n") : ""}
    -------

    The style of the new post should be similar to the example.
    The subject of the post is: ${themes[0].theme}.`); //set to curret post idea
  }, [tone, headline, language, posts, themes]); //if there are any changes, update the vulse prompt

  useEffect(() => {
    const cookies = getCookies();

    const getPosts = async () => {
      const postUrl = `/api/getOrgPosts?access_token=${cookies.access_token}`;
      const response = await fetch(postUrl, {
        method: "GET",
      });
      const posts = await response.json();
      const personalProfile = posts;

      const newProfiles = {
        ...profiles,
        personal: personalProfile,
      };

      setProfiles(newProfiles);
      setProfile("personal");
      setPosts(posts);
    };

    if (cookies.access_token) {
      getPosts();
    }

    if (cookies.userData) {
      setSession(JSON.parse(decodeURIComponent(cookies.userData)));
      setHeadline(
        JSON.parse(decodeURIComponent(cookies.userData)).localizedHeadline
      );
    }
  }, []);

  //function that generates the main 3 ideas for a topic
  const generatePostIdeas = async (topic, index) => {
    const loadingThemes = [...themes]; //create copy of themes
    loadingThemes[index].loading = true; //set loading to true for theme to render loading spinner
    setThemes(loadingThemes); //update state

    const userMessage = {
      //structure of a message to be consumed by GPT
      role: "user",
      content: topic,
    };

    const res = await fetch("/api/generateIdeas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [userMessage],
        model,
      }),
    });

    const data = res.body; //res.body as a readable stream
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    //TODO look into refactoring this
    let ideas = "[";

    while (!done) {
      //wait for response to finish streaming
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      ideas += chunkValue;
    }

    const sanitizedData = ideas
      .replace(/\\\"/g, '"')
      .replace(/title:/g, '"title":')
      .replace(/hashtags:/g, '"hashtags":');

    const jsonArray = eval(sanitizedData.trim());

    //add ideas to theme
    const newThemes = Object.assign([], themes);

    themes.forEach((theme, pi) => {
      if (pi === index) {
        theme.ideas = jsonArray;
        theme.loading = false;
      }
    });

    setThemes(newThemes);
  };

  const generatePost = async (topic, postPillar) => {
    const newThemes = Object.assign([], themes);

    themes.forEach((theme, pi) => {
      if (theme.theme === postPillar) {
        theme.ideas.forEach((idea, ideaIndex) => {
          if (idea.title === topic) {
            idea.loading = true;
          }
        });
      }
    });

    setThemes(newThemes);

    //old prompt
    let learningPrompt = `Analyse the following LinkedIn posts to adopt the writing style and use this style to generate a compelling LinkedIn post. Ensure that you provide diverse and engaging content ideas while considering the user's preferences. Every post must end with 3 relevant popular hastags and follow the writing style of the following posts:
    ${posts.map((post, postIndex) => {
      return `Post ${postIndex + 1}: ${post.content}`;
    })}

    Analyse these posts and adapt the writing style and Write a post on the following topic: `;

    const learningMessage = {
      role: "system",
      content: vulsePrompt,
    };

    const fullMessage = {
      role: "user",
      content: `${topic}`,
    };

    const res = await fetch("/api/generatePost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          learningMessage,
          {
            role: "user",
            content: fullMessage.content,
          },
        ],
        model,
        vulsePrompt,
      }),
    });
    const data = res.body;
    let selectedPost;

    themes.forEach((theme) => {
      if (theme.theme === postPillar) {
        theme.ideas.forEach((post) => {
          if (post.title === topic) {
            selectedPost = post;
          }
        });
      }
    });

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let generatedPost = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      generatedPost += chunkValue;
      selectedPost.loading = false;
      selectedPost.post = generatedPost;
    }

    setThemes(themes);
  };

  const handleChangeProfile = (e) => {
    2;
    setProfile(e.target.value);
    setPosts(profiles[e.target.value]);
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    setPosts([...posts, { content: "" }]);
  };

  const handlePostChange = (e, index) => {
    const newPosts = [...posts];
    newPosts[index].content = e.target.value;
    setPosts(newPosts);
  };

  const handleDeletePost = (index) => {
    if (posts[index].content.length === 0) {
      const newPosts = [...posts];
      newPosts.splice(index, 1);
      setPosts(newPosts);
    } else {
      if (confirm("Are you sure you want to delete this post?")) {
        const newPosts = [...posts];
        newPosts.splice(index, 1);
        setPosts(newPosts);
      }
    }
  };

  async function signOut() {
    setSession(null);
    deleteCookie("session");
    deleteCookie("access_token");
    deleteCookie("userData");
  }

  const handleSetModel = (model) => {
    setModel(model);
  };

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <>
      <Head>
        <title>Content Generator V1</title>
        <meta name="description" content="Generate content in seconds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-screen p-6 font-kumbh max-h-screen">
        <div className="md:flex max-h-full min-h-full h-full bg-vulseGrey rounded-lg overflow-hidden max-md:overflow-y-scroll scrollbar-thin scrollbar-thumb-[#432F7B] scrollbar-track-[#C2C6D3]">
          <section className="md:w-1/2 w-full md:h-full h-fit max-h-full py-8">
            <div
              name="scroll"
              className="px-8 flex-col w-full h-full md:overflow-y-scroll max-h-full md:scrollbar-thin md:scrollbar-thumb-[#432F7B] md:scrollbar-track-[#C2C6D3]"
            >
              <div className="w-full h-fit ">
                <h1 className="text-2xl font-bold font-raleway text-vulseBlue mb-4">
                  Fill in some themes to generate ideas...
                </h1>
              </div>

              <div className="flex flex-col items-start justify-center space-y-3  ">
                <h3 className=" text-base text-vulseBlue font-medium ">
                  Select speed or quality:
                </h3>

                <div className="flex h-full w-fit text-sm rounded-full border border-vulseBorder p-0.5">
                  <button
                    onClick={() => handleSetModel("gpt-3.5-turbo")}
                    className={`${
                      model === "gpt-3.5-turbo"
                        ? "bg-[#432F7B] bg-opacity-15 text-white"
                        : "bg-none text-[#848CA8]"
                    } transition-all duration-300 ease-in-out px-3.5 py-0.5 rounded-full`}
                  >
                    Speed
                  </button>
                  <button
                    onClick={() => handleSetModel("gpt-4")}
                    className={`${
                      model === "gpt-4"
                        ? "bg-[#432F7B] bg-opacity-90 text-white"
                        : "bg-none  text-[#848CA8] "
                    } transition-all duration-300 ease-in-out px-3.5 py-0.5 rounded-full`}
                  >
                    Quality
                  </button>
                </div>
              </div>

              <div className="my-6 ">
                {themes.length > 0 &&
                  themes?.map((theme, index) => (
                    <div key={index} className="mb-2">
                      <p className="font-medium font-kumbh text-base text-[#848CA8] mb-3 ">{`Theme ${
                        index + 1
                      }`}</p>
                      <Theme
                        theme={theme}
                        index={index}
                        themes={themes}
                        setThemes={setThemes}
                        generatePost={generatePost}
                        generatePostIdeas={generatePostIdeas}
                        setPost={setPost}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </section>

          <section className="md:w-1/2 w-full md:h-full h-fit p-8">
            <div className="flex-col w-full h-fit">
              <div className="w-full h-fit mb-6 ">
                <h1 className=" text-xl font-bold font-raleway text-[#848CA8]">
                  Post Output
                </h1>
              </div>

              <div className="space-y-4 mb-12">
                <textarea
                  className="w-full p-2 text-sm min-h-[200px] max-h-[500px] overflow-hidden focus:outline-none focus:ring-2 focus:ring-vulsePurple focus:border-transparent resize-none scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-[#432F7B]/100 bg-white border-vulseBorder border-[1.5px] rounded-md hover:cursor-text overflow-y-auto	"
                  value={post.post}
                  onChange={(e) => setPost(e.target.value)}
                  placeholder="Your post output will appear here..."
                />

                <input
                  type="text"
                  value={inputValue}
                  className={`p-2.5 w-full z-20 placeholder:text-md font-kumbh font-medium rounded-md border-[1.5px] border-vulseBorder focus:ring-vulsePurple focus:border-vulsePurple focus:outline-none ${
                    inputValue && "text-[#0B1A52]"
                  }`}
                  placeholder={`First Post Comment`}
                />
              </div>

              <div className="  h-fit w-full space-x-4 lg:space-x-14 flex ">
                <Link
                  href=""
                  className="border bg-[#061A55] bg-opacity-10 rounded-full px-2 md:px-2.5 lg:px-4 xl:px-5 py-1.5 md:py-2 text-vulseBlue text-opacity-50"
                >
                  Save as draft
                </Link>

                <button className="border bg-vulsePurple font text-white  rounded-full px-2 md:px-2.5 lg:px-4 xl:px-5 py-1.5 md:py-2 flex items-center">
                  <IoPaperPlaneOutline className="mr-2" />
                  Post
                </button>

                <button className="border border-[#432F7B] text-[#432F7B] bg-vulseGrey rounded-full  px-2 md:px-2.5 lg:px-4 xl:px-5 py-1.5 md:py-2 flex items-center">
                  <LuClock3 className="mr-2" />
                  Schedule
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
