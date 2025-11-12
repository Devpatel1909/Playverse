import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../cricket/UI/dialog.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../cricket/UI/card.jsx';
import { Button } from '../../cricket/UI/button.jsx';

export default function AnalyticsModal({ open, onOpenChange, stats }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl text-white border bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Analytics Dashboard</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Total Sports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats?.totalSports ?? 3}</div>
                <p className="text-xs text-slate-400">Active sports</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Total Teams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats?.totalTeams ?? 36}</div>
                <p className="text-xs text-slate-400">Registered teams</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Total Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats?.totalPlayers ?? 596}</div>
                <p className="text-xs text-slate-400">Registered players</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Sub-Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats?.totalSubAdmins ?? 9}</div>
                <p className="text-xs text-slate-400">Active sub-admins</p>
              </CardContent>
            </Card>
          </div>
          <div className="pt-4">
            <Button onClick={() => onOpenChange(false)} className="w-full text-white bg-slate-600 hover:bg-slate-700">Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
