import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../cricket/UI/dialog.jsx';
import { Input } from '../../cricket/UI/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../cricket/UI/select.jsx';
import { Button } from '../../cricket/UI/button.jsx';

export default function AddTeamModal({ open, onOpenChange, onSubmit }) {
  const [form, setForm] = useState({ name: '', sport: '', captain: '', coach: '', location: '' });

  const submit = (e) => {
    e && e.preventDefault();
    if (onSubmit) onSubmit(form);
    setForm({ name: '', sport: '', captain: '', coach: '', location: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-white border bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Add New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Team Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter team name" required className="text-white bg-slate-700 border-slate-600" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Sport</label>
            <Select value={form.sport} onValueChange={(value) => setForm({ ...form, sport: value })}>
              <SelectTrigger className="text-white bg-slate-700 border-slate-600">
                <SelectValue placeholder="Select sport" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="cricket">Cricket</SelectItem>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="kabaddi">Kabaddi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Captain</label>
            <Input value={form.captain} onChange={(e) => setForm({ ...form, captain: e.target.value })} placeholder="Enter captain name" className="text-white bg-slate-700 border-slate-600" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Coach</label>
            <Input value={form.coach} onChange={(e) => setForm({ ...form, coach: e.target.value })} placeholder="Enter coach name" className="text-white bg-slate-700 border-slate-600" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Location</label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Enter team location" className="text-white bg-slate-700 border-slate-600" />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Create Team</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
  