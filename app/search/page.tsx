"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import Link from "next/link"
import Image from "next/image"
import { 
  Dumbbell, 
  Utensils, 
  LineChart, 
  Users, 
  FileText, 
  Info, 
  ArrowRight, 
  Clock,
  Bookmark
} from "lucide-react"

// Mock search results for demonstration
const mockWorkouts = [
  { id: 1, title: "Full Body Strength", type: "Strength", duration: "45 min", level: "Intermediate", equipment: "Dumbbells, Bench", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 2, title: "HIIT Cardio Blast", type: "Cardio", duration: "30 min", level: "Advanced", equipment: "None", image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 3, title: "Core Strengthening", type: "Core", duration: "20 min", level: "Beginner", equipment: "Mat", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
];

const mockNutrition = [
  { id: 1, title: "Protein-Packed Meal Plan", type: "Meal Plan", calories: "1800 cal", target: "Muscle Building", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 2, title: "Healthy Smoothie Recipes", type: "Recipes", calories: "Various", target: "General Health", image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 3, title: "Low-Carb Diet Guide", type: "Diet Plan", calories: "1500 cal", target: "Weight Loss", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
];

const mockArticles = [
  { id: 1, title: "The Science of Muscle Growth", type: "Fitness Science", readTime: "5 min read", author: "Dr. Fitness", date: "2023-10-12", image: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 2, title: "Nutrition Myths Debunked", type: "Nutrition", readTime: "8 min read", author: "Nutritionist Pro", date: "2023-11-05", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
  { id: 3, title: "Recovery Strategies for Athletes", type: "Recovery", readTime: "6 min read", author: "Coach Smith", date: "2023-09-28", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" },
];

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [filteredWorkouts, setFilteredWorkouts] = useState(mockWorkouts)
  const [filteredNutrition, setFilteredNutrition] = useState(mockNutrition)
  const [filteredArticles, setFilteredArticles] = useState(mockArticles)
  
  useEffect(() => {
    // Simulate API call with loading state
    setIsLoading(true)
    
    setTimeout(() => {
      // Filter results based on search query
      if (query) {
        const lowercaseQuery = query.toLowerCase()
        
        setFilteredWorkouts(
          mockWorkouts.filter(workout => 
            workout.title.toLowerCase().includes(lowercaseQuery) || 
            workout.type.toLowerCase().includes(lowercaseQuery)
          )
        )
        
        setFilteredNutrition(
          mockNutrition.filter(item => 
            item.title.toLowerCase().includes(lowercaseQuery) || 
            item.type.toLowerCase().includes(lowercaseQuery) ||
            item.target.toLowerCase().includes(lowercaseQuery)
          )
        )
        
        setFilteredArticles(
          mockArticles.filter(article => 
            article.title.toLowerCase().includes(lowercaseQuery) || 
            article.type.toLowerCase().includes(lowercaseQuery)
          )
        )
      } else {
        // If no query, show all results
        setFilteredWorkouts(mockWorkouts)
        setFilteredNutrition(mockNutrition)
        setFilteredArticles(mockArticles)
      }
      
      setIsLoading(false)
    }, 800)
  }, [query])
  
  // Get total results count
  const totalResults = filteredWorkouts.length + filteredNutrition.length + filteredArticles.length
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-muted-foreground">
            {isLoading 
              ? "Searching..." 
              : query 
                ? `Found ${totalResults} results for "${query}"` 
                : "Browse all content"
            }
          </p>
        </div>
        
        <SearchBar defaultValue={query} placeholder="Search workouts, nutrition, articles..." className="md:max-w-md" />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Results ({totalResults})</TabsTrigger>
              <TabsTrigger value="workouts">Workouts ({filteredWorkouts.length})</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition ({filteredNutrition.length})</TabsTrigger>
              <TabsTrigger value="articles">Articles ({filteredArticles.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {totalResults === 0 ? (
                <div className="text-center py-12">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    We couldn't find any matches for "{query}". Try different keywords or browse our content.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="outline" asChild>
                      <Link href="/workouts">Browse Workouts</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/nutrition">Explore Nutrition</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-10">
                  {filteredWorkouts.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <Dumbbell className="h-5 w-5 text-primary" /> Workouts
                        </h2>
                        <Button variant="link" asChild className="gap-1">
                          <Link href="/workouts">
                            View all <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <div className="grid gap-6 md:grid-cols-3">
                        {filteredWorkouts.map(workout => (
                          <Card key={workout.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-40">
                              <Image 
                                src={workout.image} 
                                alt={workout.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                              <div className="absolute bottom-3 left-3 flex gap-2">
                                <Badge className="bg-primary/80 hover:bg-primary">{workout.type}</Badge>
                                <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                                  <Clock className="h-3 w-3 mr-1" /> {workout.duration}
                                </Badge>
                              </div>
                            </div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{workout.title}</CardTitle>
                              <CardDescription>{workout.level} • {workout.equipment}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button asChild className="w-full">
                                <Link href={`/workouts/${workout.id}`}>View Workout</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {filteredNutrition.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <Utensils className="h-5 w-5 text-primary" /> Nutrition
                        </h2>
                        <Button variant="link" asChild className="gap-1">
                          <Link href="/nutrition">
                            View all <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <div className="grid gap-6 md:grid-cols-3">
                        {filteredNutrition.map(item => (
                          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-40">
                              <Image 
                                src={item.image} 
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                              <div className="absolute bottom-3 left-3 flex gap-2">
                                <Badge className="bg-green-600/80 hover:bg-green-600">{item.type}</Badge>
                                <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                                  {item.calories}
                                </Badge>
                              </div>
                            </div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                              <CardDescription>Target: {item.target}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button asChild className="w-full">
                                <Link href={`/nutrition/${item.id}`}>View Plan</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {filteredArticles.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" /> Articles
                        </h2>
                        <Button variant="link" asChild className="gap-1">
                          <Link href="/articles">
                            View all <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                      <div className="grid gap-6 md:grid-cols-3">
                        {filteredArticles.map(article => (
                          <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-40">
                              <Image 
                                src={article.image} 
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                              <div className="absolute bottom-3 left-3 flex gap-2">
                                <Badge className="bg-blue-600/80 hover:bg-blue-600">{article.type}</Badge>
                              </div>
                            </div>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{article.title}</CardTitle>
                              <CardDescription className="flex items-center justify-between">
                                <span>By {article.author}</span>
                                <span className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" /> {article.readTime}
                                </span>
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <Button asChild className="w-full">
                                <Link href={`/articles/${article.id}`}>Read Article</Link>
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="workouts" className="mt-6">
              {filteredWorkouts.length === 0 ? (
                <div className="text-center py-12">
                  <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No workout results found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    We couldn't find any workouts matching "{query}". Try different keywords or browse our workout library.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/workouts">Browse All Workouts</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {filteredWorkouts.map(workout => (
                    <Card key={workout.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <Image 
                          src={workout.image} 
                          alt={workout.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 flex gap-2">
                          <Badge className="bg-primary/80 hover:bg-primary">{workout.type}</Badge>
                          <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                            <Clock className="h-3 w-3 mr-1" /> {workout.duration}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-3 right-3 text-white bg-black/30 hover:bg-black/50"
                        >
                          <Bookmark className="h-4 w-4" />
                          <span className="sr-only">Save workout</span>
                        </Button>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{workout.title}</CardTitle>
                        <CardDescription>{workout.level} • {workout.equipment}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full">
                          <Link href={`/workouts/${workout.id}`}>View Workout</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="nutrition" className="mt-6">
              {/* Similar to workout tab with nutrition items */}
              {filteredNutrition.length === 0 ? (
                <div className="text-center py-12">
                  <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No nutrition results found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    We couldn't find any nutrition plans matching "{query}". Try different keywords or browse our nutrition section.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/nutrition">Browse Nutrition Plans</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {filteredNutrition.map(item => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <Image 
                          src={item.image} 
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 flex gap-2">
                          <Badge className="bg-green-600/80 hover:bg-green-600">{item.type}</Badge>
                          <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                            {item.calories}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>Target: {item.target}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full">
                          <Link href={`/nutrition/${item.id}`}>View Plan</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="articles" className="mt-6">
              {/* Similar to workout tab with article items */}
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No article results found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    We couldn't find any articles matching "{query}". Try different keywords or browse our article library.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/articles">Browse All Articles</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {filteredArticles.map(article => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <Image 
                          src={article.image} 
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-blue-600/80 hover:bg-blue-600">{article.type}</Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <CardDescription className="flex items-center justify-between">
                          <span>By {article.author}</span>
                          <span className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" /> {article.readTime}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full">
                          <Link href={`/articles/${article.id}`}>Read Article</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
} 