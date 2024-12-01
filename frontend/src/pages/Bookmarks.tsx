import { ErrorMessage } from "../components/ErrorMessage";
import { Loader } from "../components/Loader";
import { Navbar } from "../components/Navbar";
import { useBookmarks } from "../hooks/useBookmarks";
import { BlogCard } from "../components/BlogCard";

export const Bookmarks = () => {
  const { blogs, loading, error } = useBookmarks();

  if(loading) {
    return (
      <Loader />
    )
  }

  console.log("bookmarks: ", blogs);

  if(blogs.length == 0) {
    return (
      <div className="w-full h-screen flex flex-col">
        <Navbar />
        <div className="h-max flex flex-1 justify-center items-center">
          <div className="text-xl font-bold font-mono">You don't have any bookmarks</div>
        </div>
      </div>
    )
  }

  if(error) {
    return (
      <ErrorMessage error={error} />
    )
  }

  return (
    <div>
      <Navbar />
      <section className="flex justify-center items-center">
          <div className=" h-screen max-w-7xl w-full px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-2">
              { 
                blogs.map((blog) => (
                  <BlogCard key={blog.id} 
                    authorName={blog.author.name}
                    title={blog.title}
                    content={blog.content}
                    createdAt={new Date(blog.createdAt).toLocaleDateString()} />
                ))
              }
          </div>
          </div>
        </section>
    </div>
  )
}