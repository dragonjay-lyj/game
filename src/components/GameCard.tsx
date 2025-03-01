import React, { useState } from "react";
import { Card, CardBody, CardFooter, Image, Chip, Button, Tooltip, Link } from "@heroui/react";
import { motion } from "framer-motion";
import type { CollectionEntry } from "astro:content";

// Icons
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={`h-5 w-5 ${filled ? "fill-red-500" : "fill-none stroke-current"}`} 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

interface GameCardProps {
  game: CollectionEntry<"games">;
  className?: string;
  featured?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  className = "",
  featured = false
}) => {
  const { data, slug } = game;
  // 使用静态初始值避免水合错误
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className={className}
    >
      {/* 不使用isPressable，避免Card渲染为button */}
      <Card 
        isHoverable
        className={`game-card overflow-hidden bg-gradient-to-br from-background to-default-100 dark:from-default-100 dark:to-default-200/20 border border-transparent cursor-pointer ${
          featured ? "sm:col-span-2 md:col-span-2" : ""
        }`}
        shadow="sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        href={`/games/${slug}`}
        as={Link}
      >
        <CardBody className="p-0 overflow-hidden">
          <div className="relative w-full overflow-hidden">
              <div className="relative group">
                <Image
                  src={data.coverImage}
                  alt={data.title}
                  className={`w-full object-cover transition-transform duration-700 ${
                    isHovered ? "scale-110" : "scale-100"
                  }`}
                  radius="none"
                  shadow="none"
                  height={featured ? 340 : 240}
                  width="100%"
                  onLoad={() => setIsLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* 收藏按钮 - 使用div包装避免事件冒泡 */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <div onClick={(e) => e.stopPropagation()}>
                    <Tooltip content={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                      <Button 
                        isIconOnly
                        size="sm" 
                        variant="light" 
                        className="bg-white/30 backdrop-blur-md dark:bg-black/30 text-white"
                        onClick={handleFavoriteClick}
                      >
                        <HeartIcon filled={isFavorite} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                
                {/* Release year chip */}
                <Chip
                  className="absolute bottom-2 right-2 bg-black/50 dark:bg-white/20 backdrop-blur-md text-white border-none"
                  size="sm"
                  variant="shadow"
                >
                  {data.releaseYear}
                </Chip>
                
                {/* Genre badges - only shown when hovered */}
                {data.genres && data.genres.length > 0 && (
                  <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {data.genres.slice(0, 2).map((genre, index) => (
                      <Chip
                        key={index}
                        size="sm"
                        className="bg-primary-500/80 backdrop-blur-md text-white border-none"
                      >
                        {genre}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
          </div>
          
          <div className="p-3 pt-4">
              <h3 className="text-lg font-bold line-clamp-2 group-hover:text-primary-500 transition-colors duration-300">
                {data.title}
              </h3>
            
            {data.description && (
                <p className="text-sm text-foreground-500 mt-1 line-clamp-2">
                  {data.description}
                </p>
            )}
          </div>
        </CardBody>
        
        {data.fileSize && (
          <CardFooter className="p-3 pt-0 text-xs text-foreground-500 justify-between">
              <div className="flex items-center gap-2">
                <DownloadIcon />
                {data.fileSize}
              </div>
          </CardFooter>
        )}
        
        {/* View details overlay - 使用div而不是Button */}
        <div className={`absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-500 ${
          isHovered ? "bg-black/40" : "opacity-0"
        }`}>
          <div className="opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500">
            <Chip
              size="lg"
              color="primary"
              variant="shadow"
              className="px-4 py-2 font-medium"
            >
              View Details
            </Chip>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default GameCard;
