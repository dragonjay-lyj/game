import React, { useState, useEffect } from "react";
import { Tabs, Tab, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Input, Pagination, Chip, Skeleton } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import type { CollectionEntry } from "astro:content";
import GameCard from "./GameCard";

// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
  </svg>
);

const SortIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
  </svg>
);

interface GameGridProps {
  games: CollectionEntry<"games">[];
  title?: string;
  description?: string;
  categories?: string[];
  defaultCategory?: string;
}

type SortOption = "newest" | "oldest" | "alphabetical" | "rating";

export const GameGrid: React.FC<GameGridProps> = ({ 
  games, 
  title = "Games Library", 
  description,
  categories = ["All Games", "Action", "Adventure", "RPG", "Strategy"],
  defaultCategory = "All Games"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  const itemsPerPage = 12;
  
  // Extract all unique genres from games
  const allGenres = Array.from(
    new Set(
      games.flatMap(game => game.data.genres || [])
    )
  );
  
  // Filter games based on search, category, and selected genres
  const filteredGames = games.filter(game => {
    const matchesSearch = searchQuery === "" || 
      game.data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (game.data.description && game.data.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === "All Games" || 
      (game.data.genres && game.data.genres.includes(activeCategory));
    
    const matchesGenres = selectedGenres.length === 0 || 
      (game.data.genres && selectedGenres.every(genre => game.data.genres!.includes(genre)));
    
    return matchesSearch && matchesCategory && matchesGenres;
  });
  
  // Sort filtered games
  const sortedGames = [...filteredGames].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.data.publishedDate || 0).getTime() - new Date(a.data.publishedDate || 0).getTime();
      case "oldest":
        return new Date(a.data.publishedDate || 0).getTime() - new Date(b.data.publishedDate || 0).getTime();
      case "alphabetical":
        return a.data.title.localeCompare(b.data.title);
      default:
        return 0;
    }
  });
  
  // Paginate games
  const totalPages = Math.ceil(sortedGames.length / itemsPerPage);
  const currentGames = sortedGames.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Feature the first game if there are more than 5 games
  const shouldFeatureFirst = currentGames.length >= 5;
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, sortOption, selectedGenres]);
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Toggle genre selection
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header with animated title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {title && (
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-foreground/90 group flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
              {title}
            </span>
            <span className="block w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 ml-4 transition-all duration-300 group-hover:w-32 rounded-full"></span>
          </h2>
        )}
        
        {description && (
          <p className="text-foreground/60 mb-6 max-w-2xl text-lg">
            {description}
          </p>
        )}
      </motion.div>
      
      {/* Filters and search section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Search input */}
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<SearchIcon />}
              isClearable
              onClear={() => setSearchQuery("")}
              classNames={{
                input: "text-sm",
                inputWrapper: "bg-default-100 dark:bg-default-50/20 backdrop-blur-md"
              }}
            />
          </div>
          
          {/* Filters and sort */}
          <div className="flex gap-2 flex-wrap">
            {/* Genre filter dropdown */}
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="flat" 
                  startContent={<FilterIcon />}
                  endContent={selectedGenres.length > 0 && (
                    <Chip size="sm" color="primary" variant="flat">
                      {selectedGenres.length}
                    </Chip>
                  )}
                >
                  类型
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Genre Filters"
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={new Set(selectedGenres)}
                onSelectionChange={(keys) => setSelectedGenres(Array.from(keys as Set<string>))}
              >
                {allGenres.map((genre) => (
                  <DropdownItem key={genre}>{genre}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            
            {/* Sort dropdown */}
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat" startContent={<SortIcon />}>
                  排序
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Sort Options"
                onAction={(key) => setSortOption(key as SortOption)}
              >
                <DropdownItem key="newest" description="Latest releases first">最新的第一</DropdownItem>
                <DropdownItem key="oldest" description="Oldest releases first">古老的第一</DropdownItem>
                <DropdownItem key="alphabetical" description="A to Z">字母顺序排列</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        
        {/* Category tabs */}
        <Tabs 
          aria-label="Game Categories" 
          selectedKey={activeCategory}
          onSelectionChange={(key) => setActiveCategory(key as string)}
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          {categories.map((category) => (
            <Tab key={category} title={
              <div className="flex items-center space-x-2">
                <span>{category}</span>
                {category !== "All Games" && (
                  <Chip size="sm" variant="flat">
                    {games.filter(game => 
                      game.data.genres && game.data.genres.includes(category)
                    ).length}
                  </Chip>
                )}
              </div>
            } />
          ))}
        </Tabs>
      </motion.div>
      
      {/* Results summary */}
      <div className="flex justify-between items-center mb-4 text-sm text-foreground/60">
        <div>
          Showing {Math.min(filteredGames.length, itemsPerPage)} of {filteredGames.length} games
          {selectedGenres.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedGenres.map(genre => (
                <Chip 
                  key={genre} 
                  onClose={() => toggleGenre(genre)}
                  size="sm"
                  variant="flat"
                  color="primary"
                >
                  {genre}
                </Chip>
              ))}
              {selectedGenres.length > 0 && (
                <Button 
                  size="sm" 
                  variant="light" 
                  onClick={() => setSelectedGenres([])}
                  className="text-xs h-6 px-2"
                >
                  清除所有
                </Button>
              )}
            </div>
          )}
        </div>
        
        <div>
        按: <span className="font-medium text-foreground/80">{getSortLabel(sortOption)}</span>
        </div>
      </div>
      
      {/* Game grid with animations */}
      {isLoading ? (
        // Loading skeleton
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="rounded-xl">
              <div className="h-[350px] rounded-xl bg-default-300"></div>
            </Skeleton>
          ))}
        </div>
      ) : (
        <>
          {currentGames.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory + sortOption + currentPage + selectedGenres.join(",")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {currentGames.map((game, index) => (
                  <GameCard 
                    key={game.slug} 
                    game={game} 
                    featured={shouldFeatureFirst && index === 0}
                    className={shouldFeatureFirst && index === 0 ? "sm:col-span-2 md:col-span-2" : ""}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-2">没有找到游戏</h3>
              <p className="text-foreground/60 max-w-md">
              我们找不到任何符合你当前过滤器的游戏。试着调整你的搜索或过滤器。
              </p>
              <Button 
                color="primary" 
                variant="flat" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All Games");
                  setSelectedGenres([]);
                  setSortOption("newest");
                }}
              >
                重置所有过滤器
              </Button>
            </motion.div>
          )}
        </>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            color="primary"
            showControls
            showShadow
          />
        </div>
      )}
      
      {/* Back to top button */}
      <motion.button
        className="fixed bottom-6 right-6 p-3 rounded-full bg-primary-500 text-white shadow-lg z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: window.scrollY > 300 ? 1 : 0,
          scale: window.scrollY > 300 ? 1 : 0.5,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
};

// Helper function to get sort label
function getSortLabel(sortOption: SortOption): string {
  switch (sortOption) {
    case "newest": return "Newest First";
    case "oldest": return "Oldest First";
    case "alphabetical": return "Alphabetical";
    case "rating": return "Rating";
    default: return "Newest First";
  }
}

export default GameGrid;
