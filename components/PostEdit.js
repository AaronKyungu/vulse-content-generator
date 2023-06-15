import React from "react";

function PostEdit({ post, setPost }) {
  return (
    <div className="flex w-full max-w-full min-h-[200px] max-h-[500px]">
      <textarea
        className="w-full p-2 text-xs min-h-[200px] max-h-[500px] focus:outline-none focus:ring-2 focus:ring-vulsePurple focus:border-transparent resize-none scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-[#432F7B]/100 bg-white border-vulseBorder border-[1.5px] rounded-md hover:cursor-text overflow-y-auto	"
        value={post.post}
        onChange={(e) => setPost(e.target.value)}
      />
    </div>
  );
}

export default PostEdit;
