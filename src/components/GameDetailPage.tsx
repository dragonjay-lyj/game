import React, { useState, useEffect, useRef, type JSX } from "react";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter,
  Button, 
  Image, 
  Chip, 
  Tabs, 
  Tab, 
  Breadcrumbs, 
  BreadcrumbItem,
  Divider,
  Tooltip,
  Switch,
  Skeleton,
  Avatar,
  Input
} from "@heroui/react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { CollectionEntry } from "astro:content";
import TwikooComments from "../components/TwikooComments";

// Icons
const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const CodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
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

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
  </svg>
);

interface GameDetailPageProps {
  game: CollectionEntry<"games">;
}

export const GameDetailPage: React.FC<GameDetailPageProps> = ({ game }) => {
  const { data, body } = game;
  const [showAllScreenshots, setShowAllScreenshots] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [autoplayEnabled, setAutoplayEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.95]);
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.98]);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const toggleScreenshots = () => {
    setShowAllScreenshots(!showAllScreenshots);
  };
  
  const toggleTags = () => {
    setShowAllTags(!showAllTags);
  };
  
  const toggleVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    }
  };
  
  const switchVideo = (index: number) => {
    setActiveVideoIndex(index);
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      if (autoplayEnabled) {
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play();
            setIsVideoPlaying(true);
          }
        }, 100);
      }
    }
  };
  
  const toggleAutoplay = () => {
    setAutoplayEnabled(!autoplayEnabled);
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };
  
  // Display initial screenshots and the rest when "Show more" is clicked
  const visibleScreenshots = data.screenshots 
    ? showAllScreenshots 
      ? data.screenshots 
      : data.screenshots.slice(0, 6)
    : [];
  
  const hiddenScreenshots = data.screenshots 
    ? data.screenshots.slice(6) 
    : [];
  
  // Display initial tags and the rest when expanded
  const visibleTags = data.tags 
    ? showAllTags 
      ? data.tags 
      : data.tags.slice(0, 5)
    : [];
  
  const hiddenTags = data.tags 
    ? data.tags.slice(5) 
    : [];
    
  // Determine if game is new (released within last 30 days)
  const isNewRelease = data.releaseDate ? 
    new Date(data.releaseDate).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 : 
    false;

  return (
    <main className="w-full bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/90 min-h-screen">
      {/* Hero section with parallax effect */}
      <div className="relative w-full h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {data.screenshots && data.screenshots[0] && (
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src={data.screenshots[0].src}
              alt={data.title}
              classNames={{
                img: "w-full h-full object-cover object-center filter blur-[2px]"
              }}
              radius="none"
              removeWrapper
            />
          </motion.div>
        )}
        
        {/* Game title overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {data.logoImage ? (
              <Image
                src={data.logoImage}
                alt={`${data.title} logo`}
                className="max-h-32 object-contain mb-4"
              />
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-2">
                {data.title}
              </h1>
            )}
            
            <div className="flex flex-wrap gap-2 mb-4">
              {data.genres && data.genres.map((genre, index) => (
                <Chip 
                  key={index}
                  color="primary" 
                  variant="shadow"
                  size="sm"
                  as="a"
                  href={`/genres/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {genre}
                </Chip>
              ))}
              
              {isNewRelease && (
                <Chip color="success" variant="shadow" size="sm">
                  New Release
                </Chip>
              )}
              
              {data.version && (
                <Chip color="secondary" variant="shadow" size="sm">
                  {data.version}
                </Chip>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              <Button 
                color="primary" 
                variant="shadow"
                size="lg"
                startContent={<DownloadIcon />}
                className="font-bold"
                as="a"
                href="#download-section"
              >
                立即下载
              </Button>
              
              <Button
                variant="bordered"
                isIconOnly
                className="bg-white/10 backdrop-blur-md border-white/20 text-white"
                onClick={toggleFavorite}
              >
                <HeartIcon filled={isFavorite} />
              </Button>
              
              <Button
                variant="bordered"
                isIconOnly
                className="bg-white/10 backdrop-blur-md border-white/20 text-white"
                onClick={toggleShareOptions}
              >
                <ShareIcon />
              </Button>
            
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Breadcrumbs navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs size="sm" className="text-foreground-500">
          <BreadcrumbItem href="/">游戏</BreadcrumbItem>
          {data.genres && data.genres[0] && (
            <BreadcrumbItem href={`/genres/${data.genres[0].toLowerCase().replace(/\s+/g, '-')}`}>
              {data.genres[0]}
            </BreadcrumbItem>
          )}
          <BreadcrumbItem>{data.title}</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card
          className="bg-background/60 dark:bg-background/80 backdrop-blur-md border-none shadow-xl"
          isBlurred
        >
          {/* Tabs navigation */}
          <CardHeader className="flex flex-col gap-2">
            <Tabs 
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              color="primary"
              variant="underlined"
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0",
                cursor: "w-full bg-primary",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-primary"
              }}
            >
              <Tab key="overview" title="Overview" />
              <Tab key="screenshots" title="Screenshots" />
              <Tab key="videos" title="Videos" />
              <Tab key="system" title="System Requirements" />
            </Tabs>
          </CardHeader>
          
          <CardBody>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "overview" && (
                  <div className="overview-tab">
                    {/* Game info grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="md:col-span-1">
                        <Skeleton isLoaded={!isLoading} className="rounded-xl">
                          <Image
                            src={data.coverImage}
                            alt={data.title}
                            className="w-full object-cover rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]"
                            width={400}
                            height={600}
                          />
                        </Skeleton>
                        
                        {/* Quick info */}
                        <div className="mt-4 space-y-3">
                          <Skeleton isLoaded={!isLoading} className="rounded-lg h-8">
                            <div className="flex items-center gap-2">
                              <CalendarIcon />
                              <span className="font-medium">上映日期(待定):</span>
                              <span className="text-foreground-500">{data.releaseDate}</span>
                            </div>
                          </Skeleton>
                          
                          <Skeleton isLoaded={!isLoading} className="rounded-lg h-8">
                            <div className="flex items-center gap-2">
                              <CodeIcon />
                              <span className="font-medium">开发人员:</span>
                              <span className="text-foreground-500">{data.developer}</span>
                            </div>
                          </Skeleton>
                          
                          {data.fileSize && (
                            <Skeleton isLoaded={!isLoading} className="rounded-lg h-8">
                              <div className="flex items-center gap-2">
                                <DownloadIcon />
                                <span className="font-medium">文件大小:</span>
                                <span className="text-foreground-500">{data.fileSize}</span>
                              </div>
                            </Skeleton>
                          )}
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        {/* Game description */}
                        <Skeleton isLoaded={!isLoading} className="rounded-xl">
                          <div className="prose dark:prose-invert max-w-none">
                            {data.description && (
                              <div dangerouslySetInnerHTML={{ __html: data.description }} />
                            )}
                            {body && <div className="mt-4" dangerouslySetInnerHTML={{ __html: body }}></div>}
                          </div>
                        </Skeleton>
                        
                        {/* Tags section */}
                        {data.tags && data.tags.length > 0 && (
                          <div className="mt-6">
                            <Skeleton isLoaded={!isLoading} className="rounded-lg">
                              <div className="flex items-center mb-3">
                                <TagIcon />
                                <h3 className="ml-2 text-lg font-semibold">标签</h3>
                                
                                {data.tags.length > 5 && (
                                  <Button 
                                    onClick={toggleTags}
                                    variant="light"
                                    size="sm"
                                    className="ml-auto"
                                    endContent={<ChevronDownIcon />}
                                  >
                                    {showAllTags ? "Show Less" : "Show More"}
                                  </Button>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {visibleTags.map((tag, index) => (
                                  <Chip 
                                    key={index}
                                    variant="flat"
                                    as="a"
                                    href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="cursor-pointer hover:opacity-80"
                                  >
                                    {tag}
                                  </Chip>
                                ))}
                                
                                {showAllTags && hiddenTags.map((tag, index) => (
                                  <Chip 
                                    key={`hidden-${index}`}
                                    variant="flat"
                                    as="a"
                                    href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="cursor-pointer hover:opacity-80"
                                  >
                                    {tag}
                                  </Chip>
                                ))}
                              </div>
                            </Skeleton>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Download section */}
                    <div id="download-section" className="mt-10">
                      <Divider className="my-6" />
                      <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <DownloadIcon />
                        <span className="ml-2">下载选项</span>
                      </h2>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.downloadOptions ? (
                          data.downloadOptions.map((option, index) => (
                            <Skeleton key={index} isLoaded={!isLoading} className="rounded-xl">
                              <Card
                                isPressable
                                onPress={() => window.open(option.url, "_blank")}
                                className={`border-none ${getDownloadCardColor(option.type)}`}
                              >
                                <CardBody className="p-0">
                                  <div className="flex flex-col items-center justify-center p-6 text-white">
                                    <div className="text-3xl mb-3">
                                      {getDownloadIcon(option.type)}
                                    </div>
                                    <div className="text-lg font-bold">{option.name}</div>
                                    {option.description && (
                                      <div className="text-xs mt-1 opacity-80">{option.description}</div>
                                    )}
                                  </div>
                                </CardBody>
                              </Card>
                            </Skeleton>
                          ))
                        ) : (
                          <Skeleton isLoaded={!isLoading} className="rounded-xl">
                            <Card
                              isPressable
                              className="border-none bg-gradient-to-r from-blue-600 to-blue-800"
                            >
                              <CardBody className="p-0">
                                <div className="flex flex-col items-center justify-center p-6 text-white">
                                  <div className="text-3xl mb-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <div className="text-lg font-bold">下载种子</div>
                                  <div className="text-xs mt-1 opacity-80">直接下载torrent</div>
                                </div>
                              </CardBody>
                            </Card>
                          </Skeleton>
                        )}
                      </div>
                    </div>
                    
                    {/* Controller support */}
                    {data.controllerSupport && (
                      <div className="mt-10">
                        <Divider className="my-6" />
                        <h2 className="text-2xl font-bold mb-4">控制器支持</h2>
                        
                        <Skeleton isLoaded={!isLoading} className="rounded-xl">
                          <Card className="bg-content1/50 backdrop-blur-md">
                            <CardBody>
                              <div className="flex flex-col gap-4">
                                <div className="flex items-center">
                                  <Chip color="primary" variant="flat" size="sm">
                                    {data.controllerSupport.full ? "Full Controller Support" : "Partial Controller Support"}
                                  </Chip>
                                </div>
                                
                                <div className="flex flex-wrap gap-4">
                                  {data.controllerSupport.xbox && (
                                    <Tooltip content="Xbox Controllers">
                                      <Card className="p-3 bg-content2/50">
                                        <div className="flex items-center gap-2">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM6.77 14.23c-.38-.38-.7-.85-.94-1.35A6 6 0 014 10a6 6 0 012.5-4.88c-.4.65-.63 1.4-.63 2.19 0 1.19.46 2.3 1.29 3.13L6.77 14.23zm2.12-10.36c.37-.38.84-.7 1.34-.94A6 6 0 0110 3c.94 0 1.86.23 2.66.67-.4.65-.63 1.4-.63 2.19 0 1.19.46 2.3 1.29 3.13L10 12.71 6.77 9.48c-.83-.84-1.29-1.95-1.29-3.13 0-.79.23-1.54.63-2.19.5.24.97.56 1.34.94l1.44 1.44 1.44-1.44zM13.23 14.23L10 11l-3.23 3.23c.37.38.84.7 1.34.94.84.4 1.77.63 2.66.63.89 0 1.82-.23 2.66-.63.5-.24.97-.56 1.34-.94z" />
                                          </svg>
                                          <span>Xbox</span>
                                        </div>
                                      </Card>
                                    </Tooltip>
                                  )}
                                  
                                  {data.controllerSupport.dualshock && (
                                    <Tooltip content="DualShock (USB)">
                                      <Card className="p-3 bg-content2/50">
                                        <div className="flex items-center gap-2">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.88 13.47c.44.44 1.02.69 1.65.69.63 0 1.21-.25 1.65-.69l.82-.82.82.82c.44.44 1.02.69 1.65.69.63 0 1.21-.25 1.65-.69.91-.91.91-2.39 0-3.3L10 6.06 5.88 10.17c-.91.91-.91 2.39 0 3.3z" />
                                          </svg>
                                          <span>DualShock</span>
                                        </div>
                                      </Card>
                                    </Tooltip>
                                  )}
                                  
                                  {data.controllerSupport.dualsense && (
                                    <Tooltip content="DualSense (USB)">
                                      <Card className="p-3 bg-content2/50">
                                        <div className="flex items-center gap-2">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.88 13.47c.44.44 1.02.69 1.65.69.63 0 1.21-.25 1.65-.69l.82-.82.82.82c.44.44 1.02.69 1.65.69.63 0 1.21-.25 1.65-.69.91-.91.91-2.39 0-3.3L10 6.06 5.88 10.17c-.91.91-.91 2.39 0 3.3z" />
                                          </svg>
                                          <span>DualSense</span>
                                        </div>
                                      </Card>
                                    </Tooltip>
                                  )}
                                  
                                  {data.controllerSupport.steamDeck && (
                                    <Tooltip content={`Steam Deck: ${getSteamDeckStatusText(data.controllerSupport.steamDeck)}`}>
                                      <Card className="p-3 bg-content2/50">
                                        <div className="flex items-center gap-2">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                                          </svg>
                                          <span>Steam Deck</span>
                                          <Chip 
                                            size="sm" 
                                            color={getSteamDeckStatusColor(data.controllerSupport.steamDeck)}
                                          >
                                            {getSteamDeckStatusText(data.controllerSupport.steamDeck)}
                                          </Chip>
                                        </div>
                                      </Card>
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Skeleton>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === "screenshots" && (
                  <div className="screenshots-tab">
                    {data.screenshots && data.screenshots.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {visibleScreenshots.map((screenshot, index) => (
                            <Skeleton key={index} isLoaded={!isLoading} className="rounded-xl">
                              <Card
                                isPressable
                                className="overflow-hidden border-none"
                                onPress={() => window.open(screenshot.src, "_blank")}
                              >
                                <Image
                                  src={screenshot.thumbnail || screenshot.src}
                                  alt={screenshot.alt || `Screenshot ${index + 1}`}
                                  classNames={{
                                    img: "w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                                  }}
                                  radius="none"
                                />
                              </Card>
                            </Skeleton>
                          ))}
                          
                          {showAllScreenshots && hiddenScreenshots.map((screenshot, index) => (
                            <Skeleton key={`hidden-${index}`} isLoaded={!isLoading} className="rounded-xl">
                              <Card
                                isPressable
                                className="overflow-hidden border-none"
                                onPress={() => window.open(screenshot.src, "_blank")}
                              >
                                <Image
                                  src={screenshot.thumbnail || screenshot.src}
                                  alt={screenshot.alt || `Screenshot ${visibleScreenshots.length + index + 1}`}
                                  classNames={{
                                    img: "w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                                  }}
                                  radius="none"
                                />
                              </Card>
                            </Skeleton>
                          ))}
                        </div>
                        
                        {hiddenScreenshots.length > 0 && (
                          <div className="flex justify-center mt-6">
                            <Button
                              onClick={toggleScreenshots}
                              color="primary"
                              variant="flat"
                              endContent={<ChevronDownIcon />}
                            >
                              {showAllScreenshots ? "Show Less" : `Show ${hiddenScreenshots.length} More`}
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-5xl mb-4">📷</div>
                        <h3 className="text-xl font-bold mb-2">没有屏幕截图</h3>
                        <p className="text-foreground/60 max-w-md">
                          目前还没有这个游戏的截图。
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === "videos" && (
                  <div className="videos-tab">
                    {data.videos && data.videos.length > 0 ? (
                      <Skeleton isLoaded={!isLoading} className="rounded-xl">
                        <Card className="bg-black border-none overflow-hidden">
                          <div className="relative aspect-video">
                            <video 
                              ref={videoRef}
                              muted={true}
                              loop={true}
                              playsInline={true}
                              poster={data.videos[activeVideoIndex].thumbnail}
                              className="w-full h-full object-cover"
                              onPlay={() => setIsVideoPlaying(true)}
                              onPause={() => setIsVideoPlaying(false)}
                            >
                              {data.videos[activeVideoIndex].webm && (
                                <source src={data.videos[activeVideoIndex].webm} type="video/webm" />
                              )}
                              {data.videos[activeVideoIndex].mp4 && (
                                <source src={data.videos[activeVideoIndex].mp4} type="video/mp4" />
                              )}
                            </video>
                            
                            <Button 
                              isIconOnly
                              onClick={toggleVideo}
                              className={`absolute inset-0 m-auto bg-black/40 text-white w-16 h-16 rounded-full transition-opacity duration-300 ${isVideoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                              variant="flat"
                            >
                              <PlayIcon />
                            </Button>
                            
                            {data.videos.length > 1 && (
                              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                                {data.videos.map((_, index) => (
                                  <Button
                                    key={index}
                                    isIconOnly
                                    size="sm"
                                    onClick={() => switchVideo(index)}
                                    className={`min-w-0 w-3 h-3 rounded-full p-0 ${
                                      index === activeVideoIndex 
                                        ? 'bg-white scale-125' 
                                        : 'bg-white/50 hover:bg-white/70'
                                    }`}
                                    aria-label={`Switch to video ${index + 1}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <CardFooter className="justify-between">
                            <div className="text-sm text-white/70">
                              视频 {activeVideoIndex + 1} of {data.videos.length}
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-white/70 mr-2">自动播放</span>
                              <Switch
                                size="sm"
                                color="primary"
                                isSelected={autoplayEnabled}
                                onValueChange={toggleAutoplay}
                              />
                            </div>
                          </CardFooter>
                        </Card>
                      </Skeleton>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-5xl mb-4">🎬</div>
                        <h3 className="text-xl font-bold mb-2">没有视频</h3>
                        <p className="text-foreground/60 max-w-md">
                          目前还没有这个游戏的视频。
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === "system" && (
                  <div className="system-tab">
                    {data.systemRequirements ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.systemRequirements.minimum && (
                          <Skeleton isLoaded={!isLoading} className="rounded-xl h-full">
                            <Card className="h-full bg-content1/50 backdrop-blur-md">
                              <CardHeader>
                                <h3 className="text-xl font-bold">最低要求</h3>
                              </CardHeader>
                              <CardBody>
                                <ul className="space-y-3">
                                  {Object.entries(data.systemRequirements.minimum).map(([key, value]) => (
                                    <li key={key} className="flex flex-col">
                                      <span className="font-medium text-primary">{key}:</span>
                                      <span className="text-foreground/80">{value}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardBody>
                            </Card>
                          </Skeleton>
                        )}
                        
                        {data.systemRequirements.recommended && (
                          <Skeleton isLoaded={!isLoading} className="rounded-xl h-full">
                            <Card className="h-full bg-content1/50 backdrop-blur-md">
                              <CardHeader>
                                <h3 className="text-xl font-bold">推荐要求</h3>
                              </CardHeader>
                              <CardBody>
                                <ul className="space-y-3">
                                  {Object.entries(data.systemRequirements.recommended).map(([key, value]) => (
                                    <li key={key} className="flex flex-col">
                                      <span className="font-medium text-primary">{key}:</span>
                                      <span className="text-foreground/80">{value}</span>
                                    </li>
                                  ))}
                                </ul>
                              </CardBody>
                            </Card>
                          </Skeleton>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-5xl mb-4">💻</div>
                        <h3 className="text-xl font-bold mb-2">未指定系统要求</h3>
                        <p className="text-foreground/60 max-w-md">
                          这个游戏的系统要求没有被指定。
                        </p>
                      </div>
                    )}
                    
                    {/* Languages section */}
                    {data.languages && (
                      <div className="mt-8">
                        <Divider className="my-6" />
                        <h3 className="text-xl font-bold mb-4">语言</h3>
                        
                        <Skeleton isLoaded={!isLoading} className="rounded-xl">
                          <Card className="bg-content1/50 backdrop-blur-md">
                            <CardBody>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.languages.interface && (
                                  <div>
                                    <h4 className="text-lg font-medium mb-2">接口</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {data.languages.interface.map((lang, index) => (
                                        <Chip key={index} variant="flat" size="sm">{lang}</Chip>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {data.languages.audio && (
                                  <div>
                                    <h4 className="text-lg font-medium mb-2">音频</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {data.languages.audio.map((lang, index) => (
                                        <Chip key={index} variant="flat" size="sm">{lang}</Chip>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardBody>
                          </Card>
                        </Skeleton>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardBody>
          
          <CardFooter className="flex flex-col items-start gap-2 px-6 pb-6">
            <TwikooComments envId="https://superlative-valkyrie-233b02.netlify.app/.netlify/functions/twikoo" />
          </CardFooter>
        </Card>
      </div>
      
      {/* Share options popup */}
      <AnimatePresence>
        {showShareOptions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={toggleShareOptions}
          >
            <Card 
              className="w-full max-w-md m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="flex justify-between">
                <h3 className="text-xl font-bold">分享这个游戏</h3>
                <Button isIconOnly variant="light" onClick={toggleShareOptions}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-4">
                  <Button color="primary" variant="flat">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                  <Button color="primary" variant="flat">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </Button>
                  <Button color="primary" variant="flat">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </Button>
                  <Button color="primary" variant="flat">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                    Pinterest
                  </Button>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm mb-2">或复制链接：</p>
                  <div className="flex">
                    <Input
                      value={`https://yourgamesite.com/games/${game.slug}`}
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button color="primary" className="rounded-l-none">
                      Copy
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Back to top button */}
      <motion.button
        className="fixed bottom-6 right-6 p-3 rounded-full bg-primary-500 text-white shadow-lg z-40"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: 1,
          scale: 1,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </main>
  );
};

// Helper functions
function getDownloadButtonColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'torrent':
      return 'bg-blue-600 hover:bg-blue-700';
    case 'baidu':
      return 'bg-blue-500 hover:bg-blue-600';
    case 'aliyun':
      return 'bg-orange-500 hover:bg-orange-600';
    case 'google':
      return 'bg-red-500 hover:bg-red-600';
    case 'mega':
      return 'bg-purple-600 hover:bg-purple-700';
    case 'direct':
      return 'bg-green-600 hover:bg-green-700';
    default:
      return 'bg-gray-600 hover:bg-gray-700';
  }
}

function getDownloadCardColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'torrent':
      return 'bg-gradient-to-r from-blue-600 to-blue-800';
    case 'baidu':
      return 'bg-gradient-to-r from-blue-500 to-blue-700';
    case 'aliyun':
      return 'bg-gradient-to-r from-orange-500 to-orange-700';
    case 'google':
      return 'bg-gradient-to-r from-red-500 to-red-700';
    case 'mega':
      return 'bg-gradient-to-r from-purple-600 to-purple-800';
    case 'direct':
      return 'bg-gradient-to-r from-green-600 to-green-800';
    default:
      return 'bg-gradient-to-r from-gray-600 to-gray-800';
  }
}

function getDownloadIcon(type: string): JSX.Element {
  switch (type.toLowerCase()) {
    case 'torrent':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    case 'baidu':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
        </svg>
      );
    case 'aliyun':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
        </svg>
      );
      case 'google':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.5h-8.5a.75.75 0 000 1.5h8.5v8.5a.75.75 0 001.5 0v-8.5h8.5a.75.75 0 000-1.5h-8.5v-8.5z" />
          </svg>
        );
      case 'mega':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M2 9.5A3.5 3.5 0 005.5 13H9v2.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 15.586V13h2.5a4.5 4.5 0 10-.616-8.958 4.002 4.002 0 10-7.753 1.977A3.5 3.5 0 002 9.5zm9 3.5H9V8a1 1 0 012 0v5z" clipRule="evenodd" />
          </svg>
        );
      case 'direct':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
    }
  }
  
  function getFileExtension(type: string): string {
    switch (type.toLowerCase()) {
      case 'torrent':
        return 'torrent';
      default:
        return 'zip';
    }
  }
  
  function getSteamDeckStatusColor(status: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" {
    switch (status) {
      case 'verified':
        return "success";
      case 'playable':
        return "warning";
      case 'unsupported':
        return "danger";
      case 'unknown':
      default:
        return "default";
    }
  }
  
  function getSteamDeckStatusText(status: string): string {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'playable':
        return 'Playable';
      case 'unsupported':
        return 'Unsupported';
      case 'unknown':
      default:
        return 'Unknown';
    }
  }
  
  export default GameDetailPage;
  