import React from 'react';
import NewsChart from '../Charts/NewsChart';
import { Search, RefreshCw, ExternalLink, Calendar, User, Newspaper } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NewsDashboard({ newsState }) {
  const { 
    articles, 
    loading, 
    refreshCategory, 
    searchTerm, 
    setSearchTerm, 
    sortBy, 
    setSortBy 
  } = newsState;

  const categories = ['technology', 'space', 'science'];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 glass-card p-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Newspaper className="text-indigo-500" /> Breaking News
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Latest updates from around the globe</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
          >
            <option value="date">Sort by Date</option>
            <option value="source">Sort by Source</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main News Feed */}
        <div className="lg:col-span-3 space-y-6">
          {categories.map(category => (
            <div key={category} className="glass-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold capitalize text-slate-800 dark:text-white border-b-2 border-indigo-500 pb-1 inline-block">
                  {category}
                </h3>
                <button
                  onClick={() => refreshCategory(category)}
                  className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                  title={`Refresh ${category} news`}
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {loading && articles.length === 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-lg shrink-0"></div>
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {articles.filter(a => a.category === category).length > 0 ? (
                    articles.filter(a => a.category === category).slice(0, 5).map((article, index) => (
                      <article key={index} className="flex flex-col sm:flex-row gap-5 group">
                        <div className="w-full sm:w-48 h-32 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                          {article.image ? (
                            <img 
                              src={article.image} 
                              alt={article.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                          )}
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {article.title}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
                              {article.body || article.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-y-2 mt-auto">
                            <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-500 font-medium">
                              {article.source?.title && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" /> {article.source.title}
                                </span>
                              )}
                              {(article.dateTime || article.publishedAt) && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> 
                                  {formatDistanceToNow(new Date(article.dateTime || article.publishedAt), { addSuffix: true })}
                                </span>
                              )}
                            </div>
                            <a 
                              href={article.url || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                            >
                              Read More <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No articles found matching criteria.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar Charts/Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 sticky top-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">News Distribution</h3>
            <NewsChart articles={articles} />
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
              <p className="text-sm text-indigo-800 dark:text-indigo-200 font-medium">
                Showing {articles.length} total articles across {categories.length} categories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
