
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Brain, AlertTriangle, BarChart3, Calendar } from "lucide-react";

const predictionData = [
  { date: "Jan 21", actual: 35, predicted: 38, confidence: 85 },
  { date: "Jan 22", actual: null, predicted: 42, confidence: 82 },
  { date: "Jan 23", actual: null, predicted: 45, confidence: 78 },
  { date: "Jan 24", actual: null, predicted: 48, confidence: 75 },
  { date: "Jan 25", actual: null, predicted: 52, confidence: 72 },
  { date: "Jan 26", actual: null, predicted: 55, confidence: 68 },
  { date: "Jan 27", actual: null, predicted: 58, confidence: 65 }
];

const scenarioData = [
  { date: "Jan 21", baseline: 35, optimistic: 30, pessimistic: 45 },
  { date: "Jan 22", baseline: 42, optimistic: 35, pessimistic: 55 },
  { date: "Jan 23", baseline: 45, optimistic: 38, pessimistic: 62 },
  { date: "Jan 24", baseline: 48, optimistic: 40, pessimistic: 68 },
  { date: "Jan 25", baseline: 52, optimistic: 43, pessimistic: 75 },
  { date: "Jan 26", baseline: 55, optimistic: 45, pessimistic: 82 },
  { date: "Jan 27", baseline: 58, optimistic: 48, pessimistic: 88 }
];

const riskFactors = [
  { factor: "Population Density", impact: "High", weight: 0.85 },
  { factor: "Vaccination Rate", impact: "Medium", weight: 0.72 },
  { factor: "Mobility Patterns", impact: "High", weight: 0.88 },
  { factor: "Seasonal Factors", impact: "Low", weight: 0.45 },
  { factor: "Healthcare Capacity", impact: "Medium", weight: 0.68 }
];

export const PredictiveAnalytics = () => {
  const [selectedModel, setSelectedModel] = useState("lstm");
  const [predictionHorizon, setPredictionHorizon] = useState("7");
  const [viewType, setViewType] = useState("predictions");

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const modelAccuracy = {
    lstm: 87.5,
    arima: 82.3,
    ensemble: 89.2
  };

  return (
    <div className="space-y-6">
      {/* Model Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <span>Predictive Analytics Dashboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium">ML Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lstm">LSTM Neural Network</SelectItem>
                  <SelectItem value="arima">ARIMA Time Series</SelectItem>
                  <SelectItem value="ensemble">Ensemble Model</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Prediction Horizon</label>
              <Select value={predictionHorizon} onValueChange={setPredictionHorizon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">View Type</label>
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="predictions">Predictions</SelectItem>
                  <SelectItem value="scenarios">Scenarios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                Update Model
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {modelAccuracy[selectedModel as keyof typeof modelAccuracy]}%
              </div>
              <div className="text-sm text-blue-800">Model Accuracy</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">78%</div>
              <div className="text-sm text-green-800">Confidence Level</div>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">+18%</div>
              <div className="text-sm text-orange-800">Predicted Increase</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Prediction Chart */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span>
                  {viewType === "predictions" ? "Case Predictions" : "Scenario Analysis"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {viewType === "predictions" ? (
                    <LineChart data={predictionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${value} cases`,
                          name === 'actual' ? 'Actual' : 'Predicted'
                        ]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="actual"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="predicted"
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={scenarioData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="pessimistic" 
                        stackId="1" 
                        stroke="#ef4444" 
                        fill="#fecaca" 
                        name="Pessimistic"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="baseline" 
                        stackId="2" 
                        stroke="#3b82f6" 
                        fill="#93c5fd" 
                        name="Baseline"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="optimistic" 
                        stackId="3" 
                        stroke="#10b981" 
                        fill="#86efac" 
                        name="Optimistic"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Factors */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span>Risk Factors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">{factor.factor}</span>
                      <Badge className={getImpactColor(factor.impact)}>
                        {factor.impact}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${factor.weight * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Weight: {(factor.weight * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                <p className="text-sm font-medium">Peak Expected</p>
                <p className="text-xs text-gray-600">Jan 27-29 based on current trends</p>
              </div>
              <div className="p-2 bg-red-50 rounded border-l-4 border-red-400">
                <p className="text-sm font-medium">High Risk Period</p>
                <p className="text-xs text-gray-600">Next 5 days show increased transmission</p>
              </div>
              <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                <p className="text-sm font-medium">Intervention Impact</p>
                <p className="text-xs text-gray-600">Early measures could reduce cases by 25%</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
