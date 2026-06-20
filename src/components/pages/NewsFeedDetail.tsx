import React, { useState, useEffect } from "react";
import { getNewsPosts } from "../../utils/storage";
import { NewsPost, RoutePath } from "../../types";
import CardMedia from "../CardMedia";
import { Heart, MessageSquare, Tag, Send, Calendar, Anchor, ArrowLeft, ShieldAlert } from "lucide-react";
import { MASTER_HERO_VIDEO } from "../../data";
import BackgroundVideo from "../BackgroundVideo";

interface NewsFeedDetailProps {
  newsId: string;
  navigate: (path: RoutePath) => void;
}

export default function NewsFeedDetail({ newsId, navigate }: NewsFeedDetailProps) {
  const [news, setNews] = useState<NewsPost | null>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<{ author: string; text: string; date: string }[]>([]);
  
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    const list = getNewsPosts();
    const found = list.find((p) => p.id === newsId);
    if (found) {
      setNews(found);
      
      // Load engagement from local storage if existing
      try {
        const storedEngagement = localStorage.getItem(`cbbcl_news_eng_${newsId}`);
        if (storedEngagement) {
          const parsed = JSON.parse(storedEngagement);
          setLikes(parsed.likes ?? found.likes);
          setLiked(parsed.liked ?? false);
          setComments(parsed.comments ?? [
            { author: "Kazi Farhan (Founder VP)", text: "This is indeed an outstanding hallmark. Proud of the board's dedication.", date: "June 06" },
            { author: "Zafar Chowdury (Life Member)", text: "Magnificent progress! Can't wait for the Clubhouse opening.", date: "June 05" }
          ].slice(0, newsId === "1" ? 2 : 1));
        } else {
          setLikes(found.likes);
          setLiked(false);
          setComments([
            { author: "Kazi Farhan (Founder VP)", text: "This is indeed an outstanding hallmark. Proud of the board's dedication.", date: "June 06" },
            { author: "Zafar Chowdury (Life Member)", text: "Magnificent progress! Can't wait for the Clubhouse opening.", date: "June 05" }
          ].slice(0, newsId === "1" ? 2 : 1));
        }
      } catch (e) {
        setLikes(found.likes);
        setComments([]);
      }
    }
  }, [newsId]);

  // Persist likes & comments whenever they change
  useEffect(() => {
    if (news) {
      try {
        localStorage.setItem(
          `cbbcl_news_eng_${newsId}`,
          JSON.stringify({ likes, liked, comments })
        );
      } catch (e) {
        console.error(e);
      }
    }
  }, [likes, liked, comments, newsId, news]);

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setLiked(true);
    }
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentName.trim() && newCommentText.trim()) {
      const newComment = {
        author: newCommentName.trim(),
        text: newCommentText.trim(),
        date: "Today"
      };
      setComments((prev) => [...prev, newComment]);
      setNewCommentText("");
      setNewCommentName("");
    }
  };

  if (!news) {
    return (
      <div className="bg-bg-primary min-h-screen py-24 px-6 col-span-full">
        <div className="max-w-md mx-auto text-center space-y-6 bg-white border border-slate-200 p-8 rounded shadow-sm">
          <ShieldAlert className="w-12 h-12 text-gold mx-auto" />
          <h2 className="font-display text-xl text-text-dark font-semibold">Article Not Found</h2>
          <p className="font-sans text-xs text-text-body font-light">
            The news article you are seeking does not exist in our historical archive registries.
          </p>
          <button
            onClick={() => navigate("/news-feed.html")}
            className="w-full py-2.5 bg-navy text-white text-[10px] uppercase font-sans font-semibold tracking-wider hover:bg-gold hover:text-navy transition-colors"
          >
            ← Return to News Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Article Hero Banner */}
      <section className="relative h-96 bg-navy flex items-center justify-center overflow-hidden border-b border-gold-dark/40">
        <div className="absolute inset-0 w-full h-full">
          <BackgroundVideo src={MASTER_HERO_VIDEO} />
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
          <p className="font-sans text-[10px] tracking-[0.25em] text-gold uppercase font-bold">
            {news.category} · OFFICIAL GAZETTE RELEASE
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-light text-white tracking-tight leading-tight max-w-3xl mx-auto whitespace-pre-line">
            {news.title}
          </h1>
          <div className="font-sans text-xs text-slate-400 flex items-center justify-center space-x-2">
            <span>Home</span>
            <span className="text-white/35">▪</span>
            <span onClick={() => navigate("/news-feed.html")} className="hover:text-gold cursor-pointer transition-colors">Club Gazette</span>
            <span className="text-white/35">▪</span>
            <span className="text-gold truncate max-w-xs">{news.title}</span>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Layout */}
      <div className="py-16 px-6 max-w-4xl mx-auto space-y-8">
        {/* Prominent Fixed Back Button */}
        <div>
          <button
            onClick={() => navigate("/news-feed.html")}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-gold hover:text-gold text-slate-700 text-[11px] uppercase font-sans font-semibold tracking-wider transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to News Feed</span>
          </button>
        </div>

        <article className="bg-white border border-slate-200 p-6 sm:p-10 space-y-8 shadow-sm rounded-sm">
          {/* Header Metadata */}
          <div className="flex flex-wrap justify-between items-center gap-4 text-xs font-sans border-b border-slate-100 pb-4">
            <div className="flex items-center space-x-1.5 text-gold font-semibold uppercase tracking-wider">
              <Anchor className="w-4 h-4" />
              <span>{news.category}</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-slate-300" />
                <span>{news.date}</span>
              </span>
              <span>·</span>
              <span>By CBBCL Registry Board</span>
            </div>
          </div>

          {/* Large Cover Image */}
          {news.image && (
            <div className="w-full overflow-hidden rounded-xs border border-slate-200 bg-slate-50/50 flex items-center justify-center py-4 my-2">
              <CardMedia
                media={news.image}
                alt={news.title}
                className="w-full md:max-w-[95%] h-auto max-h-[700px] object-contain filter brightness-95 saturate-100 rounded-xs shadow-sm transition-all duration-300"
              />
            </div>
          )}

          {/* Abstract / Excerpt */}
          <div className="border-l-4 border-gold pl-4 text-base italic text-navy font-semibold leading-relaxed">
            {news.excerpt}
          </div>

          {/* Main Content Body */}
          <div className="font-sans text-sm sm:text-base text-text-body font-light leading-relaxed tracking-wide space-y-6 whitespace-pre-line border-b border-slate-100 pb-8">
            {news.content}
          </div>

          {/* Engagement panel */}
          <div className="flex items-center justify-between pt-2 border-b border-slate-100 pb-6">
            <div className="flex flex-wrap gap-1.5 items-center">
              <Tag className="w-4 h-4 text-gold-dark" />
              {news.tags.map((tag, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 px-2.5 py-1 text-[9px] font-sans font-semibold uppercase tracking-wider rounded-full font-mono">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-xs font-sans font-semibold transition-colors duration-200 ${
                  liked
                    ? "text-rose-600 bg-rose-50 border border-rose-100"
                    : "text-slate-500 hover:text-rose-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                <span>{likes} Likes</span>
              </button>
              
              <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-sans">
                <MessageSquare className="w-4 h-4" />
                <span>{comments.length} Comments</span>
              </div>
            </div>
          </div>

          {/* Interactive Commentary */}
          <div className="space-y-6 pt-2">
            <h4 className="font-display text-lg text-text-dark font-bold uppercase tracking-wider flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-gold" />
              <span>Interactive Member Commentary</span>
            </h4>

            {/* Submissions Form */}
            <form onSubmit={submitComment} className="bg-slate-50 p-6 border border-slate-200 rounded-xs space-y-4">
              <span className="block text-[9px] font-sans text-slate-400 font-bold uppercase tracking-widest">
                Post Member Feedback
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <input
                    type="text"
                    required
                    value={newCommentName}
                    onChange={(e) => setNewCommentName(e.target.value)}
                    placeholder="Your Name (or member code)"
                    className="w-full bg-white border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-gold rounded-xs transition-colors"
                  />
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write your constructive message..."
                    className="bg-white border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:border-gold flex-grow rounded-xs transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-navy hover:bg-gold hover:text-navy text-white px-5 rounded-xs transition-all flex items-center justify-center shrink-0 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-center font-sans text-xs text-text-light italic py-6">No commentary posted yet. Share your thoughts above.</p>
              ) : (
                comments.map((comm, cIdx) => (
                  <div key={cIdx} className="p-4 bg-white border border-slate-100 rounded-sm space-y-2 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-center text-[10px] font-sans">
                      <span className="text-navy font-bold uppercase tracking-wide">{comm.author}</span>
                      <span className="text-slate-400">{comm.date}</span>
                    </div>
                    <p className="font-sans text-xs text-slate-700 leading-relaxed font-light">
                      {comm.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </article>

        {/* Floating prominent back navigation button at the bottom for easy scrolling back */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => navigate("/news-feed.html")}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-navy hover:bg-gold text-white hover:text-navy text-xs uppercase font-sans font-bold tracking-wider transition-all duration-200 shadow-md rounded-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to News Feed</span>
          </button>
        </div>
      </div>
    </div>
  );
}
