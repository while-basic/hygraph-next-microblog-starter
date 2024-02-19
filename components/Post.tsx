export default function Post({ post }: any) {
  const { content, slug, createdAt } = post.post;

  const dateString = new Date(createdAt).toLocaleDateString("en-US", {
    dateStyle: "full",
  });
  const timeString = new Date(createdAt).toLocaleTimeString("en-US", {
    timeStyle: "short",
  });

  return (
    <div className="prose bg-white max-w-4xl mb-4 p-4 rounded-md">
      <div dangerouslySetInnerHTML={{ __html: content.html }}></div>
      <time dateTime={createdAt}>
        <a href={`/posts/${slug}`}>
          {dateString} at {timeString}
        </a>
      </time>
    </div>
  );
}
