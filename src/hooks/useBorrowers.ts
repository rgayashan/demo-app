import { useState, useEffect } from 'react';
import { Borrower, BorrowerPipeline } from '../types';
import { apiService } from '../services/mockApi';

  /**
   * A hook to fetch the borrower pipeline and expose the data to the component.
   *
   * The hook fetches the borrower pipeline when mounted and exposes the data,
   * loading state, and error state to the component.
   *
   * @returns An object with the following properties:
   * - `pipeline`: The fetched borrower pipeline.
   * - `loading`: Whether the hook is currently fetching the pipeline.
   * - `error`: The error message if the hook failed to fetch the pipeline.
   * - `refetch`: A function to refetch the pipeline.
   * - `getBorrowersByStatus`: A function to get borrowers by status.
   * - `getTotalCount`: A function to get the total count of borrowers in the pipeline.
   */
export const useBorrowers = () => {
  const [pipeline, setPipeline] = useState<BorrowerPipeline | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPipeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getBorrowerPipeline();
      setPipeline(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pipeline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const getBorrowersByStatus = (status: keyof BorrowerPipeline): Borrower[] => {
    return pipeline?.[status] || [];
  };

  const getTotalCount = (): number => {
    if (!pipeline) return 0;
    return pipeline.new.length + pipeline.in_review.length + pipeline.approved.length;
  };

  return {
    pipeline,
    loading,
    error,
    refetch: fetchPipeline,
    getBorrowersByStatus,
    getTotalCount,
  };
};