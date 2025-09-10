import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertTriangle, FileText, Users, CheckCircle, PhoneCall, Mail } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { apiService } from '../../services/api';

/**
 * A component that displays detailed information about a borrower.
 *
 * This component is the right-hand side of the borrower pipeline UI. It displays
 * the borrower's name, email, phone number, and loan amount. It also displays a
 * badge with the borrower's status (New, In Review, Approved, etc.).
 *
 * The component also includes an AI Explainability section, which displays any
 * AI flags that have been raised for the borrower. It also includes a Loan Summary
 * section, which displays the borrower's employment, income, existing loan, credit
 * score, and source of funds. Finally, it includes a Risk Signal section, which
 * displays any risk signals that have been triggered for the borrower.
 *
 * The component also includes buttons to request documents, send to valuer, approve
 * the loan, and escalate to the credit committee.
 */
export const BorrowerDetails: React.FC = () => {
  const { activeBorrower } = useAppStore();
  const [loading, setLoading] = useState<string | null>(null);

  if (!activeBorrower) {
    return (
      <Card className="lg:col-span-5 col-span-1 fade-in-right">
        <CardContent className="p-4 sm:p-6 text-center text-gray-500 animate-fade-in">
          <p className="text-sm sm:text-base">Select a borrower to view details</p>
        </CardContent>
      </Card>
    );
  }

  const handleAction = async (action: string, apiCall: () => Promise<any>) => {
    setLoading(action);
    try {
      const result = await apiCall();
      console.log(`${action} result:`, result);
      // In a real app, you'd show a toast notification
      alert(result.message || `${action} completed successfully`);
    } catch (error) {
      console.error(`${action} failed:`, error);
      alert(`${action} failed. Please try again.`);
    } finally {
      setLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="lg:col-span-5 col-span-1 fade-in-right">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl">{activeBorrower.name}</CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                {activeBorrower.email}
              </span>
              <span className="flex items-center gap-1">
                <PhoneCall className="h-4 w-4" />
                {activeBorrower.phone}
              </span>
            </div>
            <p className="text-2xl font-bold mt-2">
              ${activeBorrower.loan_amount?.toLocaleString() || activeBorrower.amount.toLocaleString()}
            </p>
          </div>
          <Badge className={`${getStatusColor(activeBorrower.status)} border`}>
            {activeBorrower.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Explainability Section */}
        <Accordion type="single" collapsible defaultValue="ai-flags">
          <AccordionItem value="ai-flags">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="font-semibold">AI Explainability</span>
                {activeBorrower.ai_flags && (
                  <Badge variant="destructive" className="ml-2">
                    {activeBorrower.ai_flags.length} Issues
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {activeBorrower.ai_flags?.map((flag, index) => (
                  <Alert key={index} className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-700">
                      {flag}
                    </AlertDescription>
                  </Alert>
                ))}
                
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction('Request Documents', () =>
                      apiService.requestDocuments(activeBorrower.id)
                    )}
                    disabled={loading === 'Request Documents'}
                    className="flex items-center gap-1 button-press hover-glow text-xs sm:text-sm"
                  >
                    <FileText className="h-4 w-4" />
                    {loading === 'Request Documents' ? 'Requesting...' : 'Request Documents'}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction('Send to Valuer', () =>
                      apiService.sendToValuer(activeBorrower.id)
                    )}
                    disabled={loading === 'Send to Valuer'}
                    className="flex items-center gap-1 button-press hover-glow text-xs sm:text-sm"
                  >
                    <Users className="h-4 w-4" />
                    {loading === 'Send to Valuer' ? 'Sending...' : 'Send to Valuer'}
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => handleAction('Approve', () =>
                      apiService.approveLoan(activeBorrower.id)
                    )}
                    disabled={loading === 'Approve'}
                    className="flex items-center gap-1 button-press hover-glow text-xs sm:text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    {loading === 'Approve' ? 'Approving...' : 'Approve'}
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Loan Summary */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Loan Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Employment</p>
                <p className="text-sm">{activeBorrower.employment || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Income</p>
                <p className="text-sm">
                  {activeBorrower.income ? `$${activeBorrower.income.toLocaleString()}` : 'Not provided'}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Existing Loan</p>
                <p className="text-sm">
                  {activeBorrower.existing_loan ? `$${activeBorrower.existing_loan.toLocaleString()}` : 'None'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Credit Score</p>
                <p className="text-sm">{activeBorrower.credit_score || 'Not available'}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-600">Source of Funds</p>
            <p className="text-sm">{activeBorrower.source_of_funds || 'Not provided'}</p>
          </div>

          {/* Risk Signal */}
          {activeBorrower.risk_signal && (
            <Alert className="mt-4 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-700">
                <strong>Risk Signal:</strong> {activeBorrower.risk_signal}
              </AlertDescription>
            </Alert>
          )}

          {/* Escalate Button */}
          <div className="mt-6">
            <Button
              size="lg"
              className="w-full button-press hover-glow text-sm sm:text-base"
              onClick={() => handleAction('Escalate to Credit Committee', () =>
                apiService.escalateToCommittee(activeBorrower.id)
              )}
              disabled={loading === 'Escalate to Credit Committee'}
            >
              {loading === 'Escalate to Credit Committee' 
                ? 'Escalating...' 
                : 'Escalate to Credit Committee'
              }
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};