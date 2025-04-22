"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calculator, Droplets, Dumbbell, Apple, Scale, Ruler } from "lucide-react"

export function FitnessCalculator() {
  const [activeTab, setActiveTab] = useState("bmi")
  const [age, setAge] = useState<number>(30)
  const [gender, setGender] = useState<"male" | "female">("male")
  const [weight, setWeight] = useState<number>(70)
  const [height, setHeight] = useState<number>(170)
  const [activityLevel, setActivityLevel] = useState<string>("moderate")
  const [goal, setGoal] = useState<string>("maintain")
  const [calculationResult, setCalculationResult] = useState<any>(null)
  
  // BMI calculation
  const calculateBMI = () => {
    if (!weight || !height) return
    
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    let category = ""
    
    if (bmi < 18.5) {
      category = "Underweight"
    } else if (bmi >= 18.5 && bmi < 25) {
      category = "Normal weight"
    } else if (bmi >= 25 && bmi < 30) {
      category = "Overweight"
    } else {
      category = "Obese"
    }
    
    setCalculationResult({
      value: bmi.toFixed(1),
      category,
      interpretation: `Your BMI is ${bmi.toFixed(1)}, which is classified as "${category}".`,
      recommendations: getBMIRecommendations(category)
    })
  }
  
  // Water intake calculation
  const calculateWaterIntake = () => {
    if (!weight) return
    
    // Base calculation: 30ml per kg of body weight
    let waterInMl = weight * 30
    
    // Adjust based on activity level
    switch (activityLevel) {
      case "sedentary":
        // No adjustment
        break
      case "light":
        waterInMl += 350 // Add ~350ml extra
        break
      case "moderate":
        waterInMl += 700 // Add ~700ml extra
        break
      case "very":
        waterInMl += 1000 // Add ~1L extra
        break
      case "extra":
        waterInMl += 1500 // Add ~1.5L extra
        break
    }
    
    const waterInLiters = (waterInMl / 1000).toFixed(1)
    const waterInCups = Math.round(waterInMl / 240) // ~240ml in a cup
    
    setCalculationResult({
      value: waterInLiters,
      unit: "liters",
      cups: waterInCups,
      interpretation: `Based on your weight and activity level, you should aim to drink about ${waterInLiters} liters (${waterInCups} cups) of water daily.`,
      recommendations: [
        "Carry a water bottle with you throughout the day",
        "Set reminders to drink water regularly",
        "Drink a glass of water before each meal",
        "Increase intake during hot weather or intense workouts"
      ]
    })
  }
  
  // Calorie calculator
  const calculateCalories = () => {
    if (!weight || !height || !age) return
    
    // Basal Metabolic Rate calculation using Mifflin-St Jeor Equation
    let bmr
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    
    // Activity multiplier
    let activityMultiplier
    switch (activityLevel) {
      case "sedentary":
        activityMultiplier = 1.2
        break
      case "light":
        activityMultiplier = 1.375
        break
      case "moderate":
        activityMultiplier = 1.55
        break
      case "very":
        activityMultiplier = 1.725
        break
      case "extra":
        activityMultiplier = 1.9
        break
      default:
        activityMultiplier = 1.2
    }
    
    // Total Daily Energy Expenditure
    let tdee = Math.round(bmr * activityMultiplier)
    
    // Adjust based on goal
    let goalCalories
    let calorieAdjustment = 0
    switch (goal) {
      case "lose":
        calorieAdjustment = -500 // Deficit for weight loss
        goalCalories = tdee + calorieAdjustment
        break
      case "maintain":
        goalCalories = tdee
        break
      case "gain":
        calorieAdjustment = 500 // Surplus for weight gain
        goalCalories = tdee + calorieAdjustment
        break
      default:
        goalCalories = tdee
    }
    
    setCalculationResult({
      bmr: Math.round(bmr),
      tdee,
      goalCalories,
      interpretation: `Your estimated daily calorie needs are ${goalCalories} calories to ${goal === "maintain" ? "maintain" : goal === "lose" ? "lose" : "gain"} weight.`,
      macros: calculateMacros(goalCalories),
      recommendations: getCalorieRecommendations(goal)
    })
  }
  
  // Protein calculator
  const calculateProtein = () => {
    if (!weight) return
    
    // Different protein calculations based on goals
    let proteinPerKg
    switch (goal) {
      case "lose":
        proteinPerKg = 2.0 // Higher protein for preserving muscle during weight loss
        break
      case "maintain":
        proteinPerKg = 1.6
        break
      case "gain":
        proteinPerKg = 1.8 // Higher protein for muscle building
        break
      default:
        proteinPerKg = 1.6
    }
    
    // Add more if very active
    if (activityLevel === "very" || activityLevel === "extra") {
      proteinPerKg += 0.2
    }
    
    const totalProtein = Math.round(proteinPerKg * weight)
    
    setCalculationResult({
      value: totalProtein,
      unit: "g",
      perKg: proteinPerKg.toFixed(1),
      interpretation: `Based on your weight, activity level, and goals, you should consume approximately ${totalProtein}g of protein daily (${proteinPerKg.toFixed(1)}g per kg of body weight).`,
      recommendations: [
        "Spread protein intake throughout the day",
        "Include a protein source with each meal",
        "Consider a protein shake after workouts",
        "Focus on complete protein sources (containing all essential amino acids)"
      ]
    })
  }
  
  // Helper function to calculate macros based on calorie goal
  const calculateMacros = (calories: number) => {
    let proteinPercentage, carbPercentage, fatPercentage
    
    switch (goal) {
      case "lose":
        proteinPercentage = 35
        carbPercentage = 35
        fatPercentage = 30
        break
      case "maintain":
        proteinPercentage = 30
        carbPercentage = 40
        fatPercentage = 30
        break
      case "gain":
        proteinPercentage = 25
        carbPercentage = 50
        fatPercentage = 25
        break
      default:
        proteinPercentage = 30
        carbPercentage = 40
        fatPercentage = 30
    }
    
    const proteinGrams = Math.round((calories * (proteinPercentage / 100)) / 4) // 4 calories per gram
    const carbGrams = Math.round((calories * (carbPercentage / 100)) / 4) // 4 calories per gram
    const fatGrams = Math.round((calories * (fatPercentage / 100)) / 9) // 9 calories per gram
    
    return {
      protein: { percentage: proteinPercentage, grams: proteinGrams },
      carbs: { percentage: carbPercentage, grams: carbGrams },
      fat: { percentage: fatPercentage, grams: fatGrams }
    }
  }
  
  // Helper functions for recommendations
  const getBMIRecommendations = (category: string) => {
    switch (category) {
      case "Underweight":
        return [
          "Increase calorie intake with nutrient-dense foods",
          "Focus on strength training to build muscle",
          "Consume healthy fats like avocados, nuts, and olive oil",
          "Consider consulting with a nutritionist for a personalized plan"
        ]
      case "Normal weight":
        return [
          "Maintain a balanced diet with plenty of fruits and vegetables",
          "Engage in regular physical activity (150+ minutes per week)",
          "Focus on maintaining muscle mass with strength training",
          "Stay hydrated and get adequate sleep"
        ]
      case "Overweight":
        return [
          "Create a moderate calorie deficit of 300-500 calories daily",
          "Increase protein intake to preserve muscle mass",
          "Incorporate both cardio and strength training",
          "Practice mindful eating and portion control"
        ]
      case "Obese":
        return [
          "Consult with healthcare professionals for personalized advice",
          "Start with moderate exercise like walking or swimming",
          "Focus on whole, unprocessed foods",
          "Consider tracking food intake to increase awareness",
          "Set realistic, sustainable goals for weight loss"
        ]
      default:
        return []
    }
  }
  
  const getCalorieRecommendations = (goal: string) => {
    switch (goal) {
      case "lose":
        return [
          "Focus on nutrient-dense, low-calorie foods",
          "Increase protein intake to preserve muscle mass",
          "Practice portion control and mindful eating",
          "Incorporate both cardio and strength training",
          "Aim for a moderate deficit (500 calories) for sustainable results"
        ]
      case "maintain":
        return [
          "Balance your macronutrients (protein, carbs, and fats)",
          "Eat a variety of whole foods",
          "Stay physically active with both cardio and strength exercises",
          "Monitor your weight weekly to ensure maintenance",
          "Adjust intake based on activity levels"
        ]
      case "gain":
        return [
          "Focus on nutrient-dense, calorie-rich foods",
          "Increase protein intake to support muscle growth",
          "Prioritize strength training to build muscle rather than fat",
          "Consume healthy fats for additional calories",
          "Eat frequent meals throughout the day"
        ]
      default:
        return []
    }
  }
  
  // Function to get workout recommendations based on the user's profile
  const getWorkoutRecommendations = () => {
    const bmi = weight / Math.pow(height / 100, 2)
    let workoutRecommendations = []
    
    // Base recommendations based on goal
    switch (goal) {
      case "lose":
        workoutRecommendations.push(
          "Combine cardio and strength training for optimal fat loss",
          "HIIT (High-Intensity Interval Training) 2-3 times per week",
          "Full-body strength training 2-3 times per week"
        )
        break
      case "maintain":
        workoutRecommendations.push(
          "Balanced routine with equal parts cardio and strength",
          "2-3 strength sessions per week focusing on all major muscle groups",
          "2-3 cardio sessions (mix of steady-state and intervals)"
        )
        break
      case "gain":
        workoutRecommendations.push(
          "Focus on progressive overload in strength training",
          "Split routines targeting different muscle groups",
          "Limit cardio to 1-2 sessions per week for recovery"
        )
        break
    }
    
    // Additional recommendations based on BMI
    if (bmi < 18.5) {
      workoutRecommendations.push(
        "Prioritize strength training over cardio",
        "Focus on compound movements (squats, deadlifts, bench press)",
        "Ensure adequate rest between workouts (48-72 hours per muscle group)"
      )
    } else if (bmi >= 30) {
      workoutRecommendations.push(
        "Start with low-impact activities like walking, swimming, or cycling",
        "Begin with shorter, more frequent workouts and gradually increase duration",
        "Consider working with a trainer for proper form and injury prevention"
      )
    }
    
    // Adjust based on age
    if (age > 50) {
      workoutRecommendations.push(
        "Include flexibility and balance work",
        "Allow extra recovery time between intense workouts",
        "Focus on proper form over heavy weights"
      )
    }
    
    return workoutRecommendations
  }
  
  // Handle tab change and reset result
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCalculationResult(null)
  }
  
  // Handle calculate button click
  const handleCalculate = () => {
    switch (activeTab) {
      case "bmi":
        calculateBMI()
        break
      case "water":
        calculateWaterIntake()
        break
      case "calories":
        calculateCalories()
        break
      case "protein":
        calculateProtein()
        break
      case "workout":
        setCalculationResult({
          recommendations: getWorkoutRecommendations(),
          interpretation: "Based on your profile, here are some workout recommendations:"
        })
        break
    }
  }
  
  return (
    <Card className="w-full" style={{
      background: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
      borderRadius: "12px",
      transition: "box-shadow 0.3s ease, transform 0.3s ease",
    }}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Fitness Calculator
        </CardTitle>
        <CardDescription>
          Calculate your fitness metrics and get personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="bmi" className="flex items-center gap-1">
              <Scale className="h-4 w-4" />
              <span className="hidden sm:inline">BMI</span>
            </TabsTrigger>
            <TabsTrigger value="water" className="flex items-center gap-1">
              <Droplets className="h-4 w-4" />
              <span className="hidden sm:inline">Water</span>
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center gap-1">
              <Apple className="h-4 w-4" />
              <span className="hidden sm:inline">Calories</span>
            </TabsTrigger>
            <TabsTrigger value="protein" className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Protein</span>
            </TabsTrigger>
            <TabsTrigger value="workout" className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              <span className="hidden sm:inline">Workout</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            {/* Common inputs for all calculators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(activeTab === "bmi" || activeTab === "water" || activeTab === "calories" || activeTab === "protein" || activeTab === "workout") && (
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight"
                    value={weight || ""}
                    onChange={(e) => setWeight(parseFloat(e.target.value))}
                  />
                </div>
              )}
              
              {(activeTab === "bmi" || activeTab === "calories" || activeTab === "workout") && (
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height"
                    value={height || ""}
                    onChange={(e) => setHeight(parseFloat(e.target.value))}
                  />
                </div>
              )}
              
              {(activeTab === "calories" || activeTab === "protein" || activeTab === "workout") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter age"
                      value={age || ""}
                      onChange={(e) => setAge(parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup
                      value={gender}
                      onValueChange={(value) => setGender(value as "male" | "female")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}
              
              {(activeTab === "water" || activeTab === "calories" || activeTab === "protein" || activeTab === "workout") && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="activity">Activity Level</Label>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                      <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                      <SelectItem value="moderate">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                      <SelectItem value="very">Very active (hard exercise 6-7 days/week)</SelectItem>
                      <SelectItem value="extra">Extra active (very hard exercise & physical job)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {(activeTab === "calories" || activeTab === "protein" || activeTab === "workout") && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="goal">Fitness Goal</Label>
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose">Lose Weight</SelectItem>
                      <SelectItem value="maintain">Maintain Weight</SelectItem>
                      <SelectItem value="gain">Gain Weight/Muscle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <Button onClick={handleCalculate} className="w-full">Calculate</Button>
          </div>
          
          {calculationResult && (
            <div className="mt-6 p-4 bg-secondary/30 rounded-lg space-y-3">
              {activeTab === "bmi" && (
                <>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{calculationResult.value}</div>
                    <div className="text-sm opacity-70">Your BMI</div>
                    <div className="mt-2 font-medium">{calculationResult.category}</div>
                  </div>
                </>
              )}
              
              {activeTab === "water" && (
                <div className="text-center">
                  <div className="text-3xl font-bold">{calculationResult.value} L</div>
                  <div className="text-sm opacity-70">Daily Water Intake</div>
                  <div className="mt-2">(approximately {calculationResult.cups} cups)</div>
                </div>
              )}
              
              {activeTab === "calories" && (
                <>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{calculationResult.goalCalories}</div>
                    <div className="text-sm opacity-70">Daily Calorie Goal</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm opacity-70">Protein</div>
                      <div className="font-medium">{calculationResult.macros.protein.grams}g</div>
                      <div className="text-xs">({calculationResult.macros.protein.percentage}%)</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Carbs</div>
                      <div className="font-medium">{calculationResult.macros.carbs.grams}g</div>
                      <div className="text-xs">({calculationResult.macros.carbs.percentage}%)</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-70">Fat</div>
                      <div className="font-medium">{calculationResult.macros.fat.grams}g</div>
                      <div className="text-xs">({calculationResult.macros.fat.percentage}%)</div>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === "protein" && (
                <div className="text-center">
                  <div className="text-3xl font-bold">{calculationResult.value}g</div>
                  <div className="text-sm opacity-70">Daily Protein Intake</div>
                  <div className="mt-2">{calculationResult.perKg}g per kg of body weight</div>
                </div>
              )}
              
              <div className="pt-2">
                <p className="text-sm mb-2">{calculationResult.interpretation}</p>
                
                {calculationResult.recommendations && calculationResult.recommendations.length > 0 && (
                  <>
                    <p className="text-sm font-medium mt-3">Recommendations:</p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      {calculationResult.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
} 