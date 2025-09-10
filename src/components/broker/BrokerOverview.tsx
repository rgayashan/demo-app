import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { PhoneCall, Mail, MessageCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAppStore } from '../../store/appStore';
import { BrokerInfo } from '../../types';
import { RoleGuard, PermissionGuard } from '../auth/RoleGuard';

/**
 * BrokerOverview component
 *
 * Displays an overview of the broker, including their name, deals, approval rate, and pending loans.
 * Also displays the onboarding workflow and allows the user to toggle the AI assistant.
 *
 * @returns {ReactElement} The BrokerOverview component
 */
export const BrokerOverview: React.FC = () => {
  const { isAiAssistantEnabled, toggleAiAssistant } = useAppStore();
  const [brokerInfo, setBrokerInfo] = useState<BrokerInfo | null>(null);
  const [workflow, setWorkflow] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [brokerData, workflowData] = await Promise.all([
          apiService.getBrokerInfo('1'), // Using default broker ID
          apiService.getWorkflow()
        ]);
        
        setBrokerInfo(brokerData);
        setWorkflow(workflowData.steps);
      } catch (error) {
        console.error('Failed to load broker data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Card className="lg:col-span-3">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-3 col-span-1 fade-in-right">
      <CardHeader className="animate-fade-in p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Broker Overview</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 sm:space-y-6 animate-slide-up p-4 sm:p-6">
        {/* Broker Info */}
        {brokerInfo && (
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-4">{brokerInfo.name}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="text-center animate-scale-in animate-stagger-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{brokerInfo.deals}</p>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Deals</p>
              </div>
              <div className="text-center animate-scale-in animate-stagger-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-green-600">{brokerInfo.approval_rate}</p>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Approval Rate</p>
              </div>
              <div className="text-center animate-scale-in animate-stagger-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xl sm:text-2xl font-bold text-orange-600">${brokerInfo.pending.toLocaleString()}</p>
                <p className="text-xs text-gray-600 uppercase tracking-wide">Pending</p>
              </div>
            </div>

            {/* Contact Buttons - Only visible to brokers and admins */}
            <RoleGuard roles={['broker', 'admin']}>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant="outline" className="flex-1 button-press hover-glow animate-stagger-4 text-xs sm:text-sm">
                  <PhoneCall className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" variant="outline" className="flex-1 button-press hover-glow animate-stagger-4 text-xs sm:text-sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
                <Button size="sm" variant="outline" className="flex-1 button-press hover-glow animate-stagger-4 text-xs sm:text-sm">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
              </div>
            </RoleGuard>
          </div>
        )}

        {/* Onboarding Workflow */}
        <div>
          <h4 className="font-semibold mb-3 text-sm sm:text-base">Onboarding Workflow</h4>
          <div className="space-y-2">
            {workflow.map((step, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded bg-gray-50 card-hover animate-stagger-${Math.min(index + 1, 5)}`}
              >
                <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold flex items-center justify-center">
                  {index + 1}
                </div>
                <span className="text-xs sm:text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Assistant Toggle */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-assistant" className="text-xs sm:text-sm font-medium">
              E Ardsassist
            </Label>
            <Switch
              id="ai-assistant"
              checked={isAiAssistantEnabled}
              onCheckedChange={toggleAiAssistant}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            AI-powered loan processing assistant
          </p>
        </div>
      </CardContent>
    </Card>
  );
};