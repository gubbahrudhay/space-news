import { useState, useEffect, useCallback } from 'react';
import { fetchNews as apiFetchNews } from '../services/api';
import toast from 'react-hot-toast';

const CACHE_KEY_PREFIX = 'news_cache_';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const DEFAULT_CATEGORIES = ['technology', 'space', 'science'];

export const useNews = (categories = DEFAULT_CATEGORIES) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'source'

  const getCachedData = (category) => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${category}`);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (e) {
      console.error('Cache read error', e);
    }
    return null;
  };

  const setCachedData = (category, data) => {
    try {
      localStorage.setItem(
        `${CACHE_KEY_PREFIX}${category}`,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (e) {
      console.error('Cache write error', e);
    }
  };

  const loadCategoryNews = useCallback(async (category, forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = getCachedData(category);
      if (cached) return cached;
    }

    try {
      const data = await apiFetchNews(category);
      // We only want 5 per category as per requirements, but let's say the API returns 10.
      // We'll limit it to 5 here or just take the top ones.
      const limitedData = data.slice(0, 5).map(item => ({ ...item, category }));
      setCachedData(category, limitedData);
      return limitedData;
    } catch (err) {
      console.error(`Error loading news for ${category}`, err);
      // Attempt fallback to cache even if expired
      const expiredCached = localStorage.getItem(`${CACHE_KEY_PREFIX}${category}`);
      if (expiredCached) {
        return JSON.parse(expiredCached).data;
      }
      return [];
    }
  }, []);

  const fetchAllNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const allNewsPromises = categories.map(cat => loadCategoryNews(cat, forceRefresh));
      const results = await Promise.all(allNewsPromises);
      const combined = results.flat();
      setArticles(combined);
      if (forceRefresh) toast.success('News refreshed');
    } catch (err) {
      setError('Failed to fetch news');
      toast.error('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  }, [categories, loadCategoryNews]);

  const refreshCategory = async (category) => {
    try {
      const freshData = await loadCategoryNews(category, true);
      setArticles(prev => {
        const filtered = prev.filter(a => a.category !== category);
        return [...filtered, ...freshData];
      });
      toast.success(`${category} news refreshed`);
    } catch (e) {
      toast.error(`Failed to refresh ${category} news`);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, [fetchAllNews]);

  const filteredArticles = articles.filter(article => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      article.title?.toLowerCase().includes(term) ||
      article.body?.toLowerCase().includes(term) ||
      article.source?.title?.toLowerCase().includes(term)
    );
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.dateTime || b.publishedAt || 0) - new Date(a.dateTime || a.publishedAt || 0);
    }
    if (sortBy === 'source') {
      const sourceA = a.source?.title || '';
      const sourceB = b.source?.title || '';
      return sourceA.localeCompare(sourceB);
    }
    return 0;
  });

  return { 
    articles: sortedArticles, 
    loading, 
    error, 
    refreshCategory, 
    fetchAllNews,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy
  };
};
