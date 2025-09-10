import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useAppStore } from '../../store/appStore';
import { apiService } from '../../services/mockApi';
import { BorrowerPipeline as BorrowerPipelineType, Borrower, TabType } from '../../types';

/**
 * A card component for displaying a single borrower in the pipeline.
 *
 * @param {Borrower} borrower The borrower to display.
 * @param {boolean} isActive Whether this card is currently selected.
 * @param {() => void} onClick The function to call when the card is clicked.
 *
 * @returns A JSX element to display a single borrower card.
 */
const BorrowerCard: React.FC<{ borrower: Borrower; isActive: boolean; onClick: () => void }> = ({
  borrower,
  isActive,
  onClick,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Renew':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`p-3 sm:p-4 border rounded-lg cursor-pointer card-hover button-press ${
        isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{borrower.name}</h3>
        <Badge className={`${getStatusColor(borrower.status)} text-xs`} variant="secondary">
          {borrower.status}
        </Badge>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 mb-2">{borrower.loan_type}</p>
      <p className="text-base sm:text-lg font-bold text-right text-gray-900">
        ${borrower.amount.toLocaleString()}
      </p>
    </div>
  );
};

export const BorrowerPipeline: React.FC = () => {
  const { activeTab, setActiveTab, activeBorrower, setActiveBorrower } = useAppStore();
  const [pipeline, setPipeline] = useState<BorrowerPipelineType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPipeline = async () => {
      try {
        const data = await apiService.getBorrowerPipeline();
        setPipeline(data);
        
        // Auto-select first borrower if none selected
        if (!activeBorrower && data.new.length > 0) {
          setActiveBorrower(data.new[0]);
        }
      } catch (error) {
        console.error('Failed to load pipeline:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPipeline();
  }, [activeBorrower, setActiveBorrower]);

  if (loading) {
    return (
      <Card className="lg:col-span-4">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderBorrowerList = (borrowers: Borrower[]) => (
    <div className="space-y-3">
      {borrowers.map((borrower, index) => (
        <div 
          key={borrower.id} 
          className={`fade-in-up animate-stagger-${Math.min(index + 1, 5)}`}
        >
          <BorrowerCard
            borrower={borrower}
            isActive={activeBorrower?.id === borrower.id}
            onClick={() => setActiveBorrower(borrower)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <Card className="lg:col-span-4 col-span-1 fade-in-left">
      <CardHeader className="animate-fade-in">
        <CardTitle className="text-lg sm:text-xl">Borrower Pipeline</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 animate-slide-up">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
          <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
            <TabsTrigger value="new" className="text-xs sm:text-sm">New ({pipeline?.new.length || 0})</TabsTrigger>
            <TabsTrigger value="in_review" className="text-xs sm:text-sm">In Review ({pipeline?.in_review.length || 0})</TabsTrigger>
            <TabsTrigger value="approved" className="text-xs sm:text-sm">Approved ({pipeline?.approved.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="mt-4">
            {pipeline?.new && renderBorrowerList(pipeline.new)}
          </TabsContent>

          <TabsContent value="in_review" className="mt-4">
            {pipeline?.in_review && renderBorrowerList(pipeline.in_review)}
          </TabsContent>

          <TabsContent value="approved" className="mt-4">
            {pipeline?.approved && renderBorrowerList(pipeline.approved)}
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-gray-200">
          <RadioGroup defaultValue="sanitised" className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sanitised" id="sanitised" />
              <Label htmlFor="sanitised" className="text-sm font-medium uppercase tracking-wide text-gray-700">
                F-SANITISED ACTIVE
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};