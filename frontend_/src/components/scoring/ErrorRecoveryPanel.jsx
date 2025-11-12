import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../features/cricket/ui/card';
import { Button } from '../../features/cricket/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../features/cricket/ui/dialog';
import cricketScoringAPIService from '../../services/cricketScoringAPI';

const ErrorRecoveryPanel = ({ matchId, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleUndoLastBall = async () => {
    try {
      setLoading(true);
      await cricketScoringAPIService.undoLastBall(matchId);
      onClose();
    } catch (error) {
      console.error('Failed to undo last ball:', error);
      alert('Failed to undo last ball. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (confirmAction === 'undo') {
      await handleUndoLastBall();
    }
    setConfirmAction(null);
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Error Recovery & Corrections</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setConfirmAction('undo')}
                  disabled={loading}
                >
                  Undo Last Ball
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={loading}
                >
                  Correct Score
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={loading}
                >
                  Edit Player Stats
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Match State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={loading}
                >
                  Reset Current Over
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  disabled={loading}
                >
                  Reset Innings
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <Dialog open={true} onOpenChange={() => setConfirmAction(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">
                {confirmAction === 'undo' && 'Are you sure you want to undo the last ball? This action cannot be reversed.'}
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmAction(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmAction}
                disabled={loading}
                variant="destructive"
              >
                {loading ? 'Processing...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ErrorRecoveryPanel;