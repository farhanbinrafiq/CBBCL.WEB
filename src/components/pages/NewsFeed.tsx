import React, { useState, useEffect } from "react";
import { getNewsPosts } from "../../utils/storage";
import { NewsPost } from "../../types";
import CardMedia from "../CardMedia";
import { Search, Heart, MessageSquare, Tag, X, Send, Calendar, Anchor, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";

export default function NewsFeed() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activePost, setActivePost] = useState<NewsPost | null>(null);
  const [newsList, setNewsList] = useState<NewsPost[]>([]);
  
  // Local state to simulate interactive likes and comments for the 12 posts
  const [postsState, setPostsState] = useState<Record<string, { likes: number; liked: boolean; comments: { author: string; text: string; date: string }[] }>>({});

  useEffect(() => {
    const list = getNewsPosts();
    setNewsList(list);

    const initialStates = list.reduce((acc, p) => {
      acc[p.id] = {
        likes: p.likes,
        liked: false,
        comments: [
          { author: "Kazi Farhan (Founder VP)", text: "This is indeed an outstanding hallmark. Proud of the board's dedication.", date: "June 06" },
          { author: "Zafar Chowdury (Life Member)", text: "Magnificent progress! Can't wait for the Clubhouse opening.", date: "June 05" }
        ].slice(0, p.id === "1" ? 2 : 1)
      };
      return acc;
    }, {} as Record<string, { likes: number; liked: boolean; comments: { author: string; text: string; date: string }[] }>);

    setPostsState(initialStates);
  }, []);

  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening modal when clicking like
    setPostsState((prev) => {
      const isLiked = prev[id]?.liked || false;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          liked: !isLiked,
          likes: isLiked ? (prev[id]?.likes || 1) - 1 : (prev[id]?.likes || 0) + 1
        }
      };
    });
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (activePost && newCommentName.trim() && newCommentText.trim()) {
      const postId = activePost.id;
      const dateStr = "Today";
      const newComment = {
        author: newCommentName.trim(),
        text: newCommentText.trim(),
        date: dateStr
      };

      setPostsState((prev) => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          comments: [...(prev[postId]?.comments || []), newComment]
        }
      }));

      setNewCommentText("");
      setNewCommentName("");
    }
  };

  const categories = ["All", "News", "Announcements", "Governance", "CSR", "Sports", "Cultural", "Events"];

  // Filter and search logic
  const filteredPosts = newsList.filter((post) => {
    const isPublic = !post.status || 
      post.status === "Published" || 
      (post.status === "Scheduled" && post.scheduledDate && new Date(post.scheduledDate) <= new Date());
    if (!isPublic) return false;

    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Page Header */}
      <section className="relative h-72 bg-navy flex items-center justify-center overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 w-full h-full">
          <BackgroundVideo
            src={MASTER_HERO_VIDEO}
          />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-3">
          <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Ltd.
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extralight text-white tracking-tight">
            The Ocean Gazette & <span className="font-serif italic text-gold">Club News Feed</span>
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gold">Club Gazette</span>
          </div>
        </div>
      </section>

      {/* Interactive Searching / Filter Strip Toolbar */}
      <section className="bg-white border-b border-slate-150 py-6 px-6 sticky top-20 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Active search pill */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts, archives, tags..."
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2 text-xs rounded-full focus:bg-white focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3.5 top-2.5 text-slate-400 hover:text-navy text-xs">
                Clear
              </button>
            )}
          </div>

          {/* Category Scroller Grid */}
          <div className="flex flex-wrap gap-2 items-center justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? "bg-navy text-gold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main Grid Feed with News items mapping */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        {filteredPosts.length === 0 ? (
          <div className="text-center bg-white border border-slate-200 rounded p-12 space-y-4">
            <ShieldAlert className="w-12 h-12 text-gold mx-auto" />
            <h3 className="font-display text-lg text-text-dark font-semibold">No Gazette Posts Found</h3>
            <p className="font-sans text-xs text-text-body font-light max-w-sm mx-auto">
              We couldn't find matches for "{searchTerm}" inside our archive registers. Try resetting filters.
            </p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
              className="px-5 py-2.5 bg-navy text-white text-[10px] uppercase font-sans font-semibold tracking-wider hover:bg-gold hover:text-navy"
            >
              Reset Search Parameters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const localLikes = postsState[post.id]?.likes ?? post.likes;
              const hasLiked = postsState[post.id]?.liked ?? false;
              const totalComments = postsState[post.id]?.comments.length ?? 0;

              return (
                <div
                  key={post.id}
                  onClick={() => setActivePost(post)}
                  className="bg-white border border-slate-200 hover:border-gold/60 p-6 flex flex-col justify-between h-[440px] shadow-sm hover:shadow-xl transition-all duration-300 rounded-sm cursor-pointer group"
                >
                  <div className="space-y-4">
                    {/* Header meta info */}
                    <div className="flex justify-between items-center text-[10px] font-sans">
                      <span className="text-gold uppercase tracking-[0.1em] font-semibold flex items-center space-x-1">
                        <Anchor className="w-3 h-3" />
                        <span>{post.category}</span>
                      </span>
                      <span className="text-slate-400 font-light flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-300" />
                        <span>{post.date}</span>
                      </span>
                    </div>

                    {/* Image thumb */}
                    {post.image ? (
                      <div className="h-32 overflow-hidden bg-slate-100 rounded-xs border border-slate-100">
                        <CardMedia
                          media={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 saturate-75"
                        />
                      </div>
                    ) : (
                      <div className="h-10 border-b border-dashed border-slate-200"></div>
                    )}

                    <h3 className="font-display text-base font-semibold text-text-dark leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="font-sans text-xs text-text-body font-light line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Comments/likes bar footer */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-sans">
                    {/* Tags block */}
                    <div className="flex items-center space-x-1.5 text-text-light truncate max-w-[140px]">
                      <Tag className="w-3 h-3 text-gold-dark shrink-0" />
                      <span className="truncate uppercase text-[8px] font-bold">{post.tags[0]}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Interactive Like toggle */}
                      <button
                        onClick={(e) => handleLike(post.id, e)}
                        className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-sm transition-colors ${
                          hasLiked ? "text-rose-600 bg-rose-50" : "text-slate-400 hover:text-rose-600"
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>{localLikes}</span>
                      </button>

                      {/* Comments count indicator */}
                      <div className="flex items-center space-x-1 text-slate-400">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{totalComments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Detailed Full Post Pop-up Modal */}
      <AnimatePresence>
        {activePost && (
          <div className="fixed inset-0 bg-navy/80 z-50 flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="bg-white border border-gold w-full max-w-2xl max-h-[85vh] overflow-y-auto relative rounded-sm shadow-2xl p-6 md:p-8 space-y-6"
            >
              {/* Close Button Modal info */}
              <button
                onClick={() => { setActivePost(null); setNewCommentName(""); setNewCommentText(""); }}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-gold hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & header metadata */}
              <div className="space-y-2 border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2 text-gold">
                  <Anchor className="w-4 h-4" />
                  <span className="font-sans text-[9px] uppercase font-bold tracking-widest mt-0.5">
                    {activePost.category} · OFFICIAL GAZETTE RELEASE
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-text-dark font-light leading-tight">
                  {activePost.title}
                </h2>
                <p className="font-sans text-[10px] text-text-light uppercase tracking-widest mt-1">
                  Registered: {activePost.date} by CBBCL Registry Board
                </p>
              </div>

              {/* Cover layout inside Modal */}
              {activePost.image && (
                <div className="h-64 overflow-hidden rounded-xs border border-slate-100 bg-slate-50">
                  <CardMedia
                    media={activePost.image}
                    alt="Cover banner details"
                    className="w-full h-full object-cover filter brightness-95 saturate-100"
                  />
                </div>
              )}

              {/* Content body layout */}
              <div className="font-sans text-xs sm:text-[13px] text-text-body font-light leading-relaxed tracking-wide space-y-4 border-b border-slate-100 pb-6">
                <p className="font-bold text-navy">{activePost.excerpt}</p>
                <p className="whitespace-pre-line">{activePost.content}</p>
              </div>

              {/* Interactive Engagement Comments Section */}
              <div className="space-y-6 pt-2">
                <h4 className="font-display text-lg text-text-dark font-bold uppercase tracking-wider flex items-center space-x-2">
                  <MessageSquare className="w-4.5 h-4.5 text-gold" />
                  <span>Interactive Member Commentary</span>
                </h4>

                {/* Submissions form of comment */}
                <form onSubmit={submitComment} className="bg-slate-50 p-4 border border-slate-205 rounded-xs space-y-3">
                  <span className="block text-[8px] font-sans text-slate-400 font-bold uppercase tracking-widest">
                    Post Member Feedback
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={newCommentName}
                      onChange={(e) => setNewCommentName(e.target.value)}
                      placeholder="Your Name (or member code)"
                      className="bg-white border border-slate-200 px-3 py-2 text-xs outline-none focus:border-gold"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Write your constructive message..."
                        className="bg-white border border-slate-200 px-3 py-2 text-xs outline-none focus:border-gold flex-grow"
                      />
                      <button
                        type="submit"
                        className="bg-navy hover:bg-gold hover:text-navy text-white px-4 rounded-xs transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Existing comments trail */}
                <div className="space-y-3">
                  {(postsState[activePost.id]?.comments || []).length === 0 ? (
                    <p className="text-center font-sans text-[10px] text-text-light italic">No commentary posted yet. Share your thoughts above.</p>
                  ) : (
                    (postsState[activePost.id]?.comments || []).map((comm, cIdx) => (
                      <div key={cIdx} className="p-3.5 bg-white border border-slate-100 rounded-sm space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-sans">
                          <span className="text-navy font-semibold">{comm.author}</span>
                          <span className="text-slate-400">{comm.date}</span>
                        </div>
                        <p className="font-sans text-[11px] text-slate-700 leading-relaxed font-light">
                          {comm.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
