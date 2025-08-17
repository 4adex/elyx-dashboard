"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MessageCircle, TrendingUp, User, MapPin, Heart, Brain, Shield } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Import the data structure
import { memberJourneyData } from "./data/member-journey-data"

export default function MemberJourneyDashboard() {
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [activeTab, setActiveTab] = useState("timeline")

  const { journey_metadata, weekly_conversations } = memberJourneyData

  // Generate metrics data for charts
  const adherenceData = weekly_conversations.map((week, index) => ({
    week: `Week ${index + 1}`,
    adherence: Math.round(week.week_metadata.plan_adherence * 100),
    conversations: week.week_metadata.total_conversations,
  }))

  const agentInteractionData = [
    { name: "Ruby (Concierge)", value: 35, color: "#8b5cf6" },
    { name: "Rachel (Physiotherapist)", value: 25, color: "#06b6d4" },
    { name: "Advik (Data Analyst)", value: 20, color: "#10b981" },
    { name: "Carla (Nutritionist)", value: 15, color: "#f59e0b" },
    { name: "Dr. Warren", value: 5, color: "#ef4444" },
  ]

  const getAgentColor = (role: string) => {
    const colors = {
      concierge: "bg-purple-100 text-purple-800",
      rachel: "bg-cyan-100 text-cyan-800",
      advik: "bg-emerald-100 text-emerald-800",
      carla: "bg-amber-100 text-amber-800",
      dr_warren: "bg-red-100 text-red-800",
      patient: "bg-blue-100 text-blue-800",
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  const getAgentIcon = (role: string) => {
    switch (role) {
      case "concierge":
        return "🏥"
      case "rachel":
        return "💪"
      case "advik":
        return "📊"
      case "carla":
        return "🥗"
      case "dr_warren":
        return "👨‍⚕️"
      case "patient":
        return "👤"
      default:
        return "💬"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Member Journey Dashboard</h1>
            <p className="text-gray-600">Healthcare Progress Visualization & Analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-green-700 border-green-300">
              Active Journey
            </Badge>
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {journey_metadata.total_conversations} Total Conversations
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="metrics">Metrics & Analytics</TabsTrigger>
              <TabsTrigger value="decisions">Decision Tracking</TabsTrigger>
              <TabsTrigger value="persona">Member Persona</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-6 h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Timeline */}
                <div className="lg:col-span-2">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        8-Month Journey Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[600px]">
                        <div className="space-y-4">
                          {weekly_conversations.map((week, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                                selectedWeek === week.week_metadata.week_number
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              onClick={() => setSelectedWeek(week.week_metadata.week_number)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">Week {week.week_metadata.week_number}</h3>
                                <Badge
                                  variant={
                                    week.week_metadata.week_type === "plan_adjustment" ? "destructive" : "default"
                                  }
                                >
                                  {week.week_metadata.week_type.replace("_", " ")}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                {week.week_metadata.context.substring(0, 150)}...
                              </p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4" />
                                  {week.week_metadata.total_conversations} conversations
                                </span>
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  {Math.round(week.week_metadata.plan_adherence * 100)}% adherence
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Week Details */}
                <div>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Week {selectedWeek} Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {weekly_conversations[selectedWeek - 1] && (
                        <div className="space-y-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">Context</h4>
                            <p className="text-sm text-gray-600">
                              {weekly_conversations[selectedWeek - 1].week_metadata.context}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {Math.round(weekly_conversations[selectedWeek - 1].week_metadata.plan_adherence * 100)}%
                              </div>
                              <div className="text-sm text-gray-600">Plan Adherence</div>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {weekly_conversations[selectedWeek - 1].week_metadata.total_conversations}
                              </div>
                              <div className="text-sm text-gray-600">Conversations</div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Conversations</h4>
                            <div className="space-y-2">
                              {weekly_conversations[selectedWeek - 1].conversations.map((conv, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start text-left p-3 bg-transparent min-h-0 h-auto"
                                  onClick={() => setSelectedConversation(conv)}
                                >
                                  <div className="w-full">
                                    <div className="font-medium text-sm mb-1">Conversation {idx + 1}</div>
                                  </div>
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Adherence Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={adherenceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="adherence" stroke="#3b82f6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Conversations per Week</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={adherenceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="conversations" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Agent Interaction Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={agentInteractionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {agentInteractionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Average Plan Adherence</span>
                        <span className="text-xl font-bold text-blue-600">
                          {Math.round(
                            adherenceData.reduce((acc, curr) => acc + curr.adherence, 0) / adherenceData.length,
                          )}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Total Conversations</span>
                        <span className="text-xl font-bold text-green-600">{journey_metadata.total_conversations}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium">Journey Duration</span>
                        <span className="text-xl font-bold text-purple-600">
                          {journey_metadata.journey_constraints.total_duration_months} months
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="decisions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Decision Tracking & Reasoning</CardTitle>
                  <p className="text-sm text-gray-600">
                    Track healthcare decisions and understand the reasoning behind treatments, medications, and
                    interventions.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weekly_conversations.slice(0, 2).map((week, weekIdx) => (
                      <div key={weekIdx} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">Week {week.week_metadata.week_number} Decisions</h3>
                        {week.conversations.map((conv, convIdx) => (
                          <div key={convIdx} className="mb-4 p-3 bg-gray-50 rounded-lg">
                            
                            <div className="space-y-2">
                              {conv.conversation_history
                                .filter((msg) => msg.role !== "patient")
                                .map((msg, msgIdx) => (
                                  <div key={msgIdx} className="flex items-start gap-3">
                                    <Badge className={getAgentColor(msg.role)}>
                                      {getAgentIcon(msg.role)} {msg.sender}
                                    </Badge>
                                    <div className="flex-1 text-sm">
                                      <div className="font-medium">Recommendation/Decision:</div>
                                      <div className="text-gray-600 mt-1">{msg.message}</div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="persona" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Member Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-lg">
                            {journey_metadata.patient_profile.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold">{journey_metadata.patient_profile.name}</h3>
                          <p className="text-gray-600">Age {journey_metadata.patient_profile.age}</p>
                          <p className="text-sm text-gray-500">{journey_metadata.patient_profile.occupation}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-800">Location</span>
                          </div>
                          <p className="text-sm">{journey_metadata.patient_profile.location}</p>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Heart className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-red-800">Condition</span>
                          </div>
                          <p className="text-sm">{journey_metadata.patient_profile.chronic_condition}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Health Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {journey_metadata.patient_profile.goals.map((goal, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                          <span className="text-sm">{goal}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Journey Constraints & Parameters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {journey_metadata.journey_constraints.total_duration_months}
                        </div>
                        <div className="text-sm text-gray-600">Months Duration</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {journey_metadata.journey_constraints.conversations_per_week}
                        </div>
                        <div className="text-sm text-gray-600">Conversations/Week</div>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg">
                        <div className="text-2xl font-bold text-amber-600">
                          {journey_metadata.journey_constraints.plan_adherence_target.replace("~", "")}
                        </div>
                        <div className="text-sm text-gray-600">Target Adherence</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">1/4</div>
                        <div className="text-sm text-gray-600">Travel Frequency</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Chat Sidebar */}
        <div className="w-96 border-l border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold">Conversation History</h2>
            <p className="text-sm text-gray-600">
              {selectedConversation ? "Viewing conversation details" : "Select a conversation to view"}
            </p>
          </div>

          <ScrollArea className="h-[calc(100vh-140px)]">
            {selectedConversation ? (
              <div className="p-4 space-y-4">

                <div className="space-y-3">
                  {selectedConversation.conversation_history.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.role === "patient" ? "bg-blue-100 ml-4" : "bg-gray-100 mr-4"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getAgentColor(message.role)} variant="secondary">
                          {getAgentIcon(message.role)} {message.sender}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Select a conversation from the timeline to view the chat history and agent interactions.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
