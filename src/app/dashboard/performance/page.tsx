'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function CareerPerformanceCenter() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Career Performance Center</h1>
        <p className="text-slate-500 mt-1">Your comprehensive, evidence-backed career readiness analytics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-slate-200">
          <CardHeader className="bg-slate-50 border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-700 font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Target Role Readiness
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">Software Engineer (Backend)</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-slate-900">79%</span>
                <p className="text-xs text-green-600 font-medium">+4% from last month</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Profile */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">Profile & Resume (25% weight)</span>
                  <span className="text-slate-500">Strong</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>
              {/* Domain */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">Domain Competency (25% weight)</span>
                  <span className="text-slate-500">Developing</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              {/* Coding */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-400">Coding Execution (25% weight)</span>
                  <span className="text-slate-400 text-xs flex items-center gap-1"><XCircle className="w-3 h-3"/> Not Available</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-200 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              {/* Interview */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-400">Mock Interview (25% weight)</span>
                  <span className="text-slate-400 text-xs flex items-center gap-1"><XCircle className="w-3 h-3"/> AI Provider Required</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-200 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded border">
              Readiness score is calculated using <strong className="text-slate-500">READINESS_V1</strong> based only on available platforms. Missing providers do not penalize your calculable score.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50 border-b border-blue-100 pb-3">
              <CardTitle className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Next Best Action
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-slate-700 font-medium">Complete a Domain Assessment to establish a baseline.</p>
              <p className="text-xs text-slate-500 mt-2">Your Domain Competency lacks sufficient verified evidence.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-slate-700">Application Funnel</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-600">Applications</span>
                  <span className="font-semibold text-slate-900">12</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-600 pl-4">Assessments</span>
                  <span className="font-semibold text-slate-900">3</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="text-slate-600 pl-8">Interviews</span>
                  <span className="font-semibold text-slate-900">1</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 pl-12 text-green-600">Offers</span>
                  <span className="font-semibold text-green-700">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
