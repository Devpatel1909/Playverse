import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../cricket/UI/dialog.jsx';
import { Input } from '../../cricket/UI/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../cricket/UI/select.jsx';
import { Button } from '../../cricket/UI/button.jsx';

export default function AddPlayerModal({ open, onOpenChange, onSubmit }) {
  const [form, setForm] = useState({ name: '', sport: '', team: '', position: '', age: '', contact: '' });

  const submit = (e) => {
    e && e.preventDefault();
    if (onSubmit) onSubmit(form);
    setForm({ name: '', sport: '', team: '', position: '', age: '', contact: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md text-white border bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Add New Player</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Player Name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter player name" required className="text-white bg-slate-700 border-slate-600" />
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
            <label className="block mb-2 text-sm font-medium text-slate-300">Team</label>
            <Input value={form.team} onChange={(e) => setForm({ ...form, team: e.target.value })} placeholder="Enter team name" className="text-white bg-slate-700 border-slate-600" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Position</label>
            <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Enter position" className="text-white bg-slate-700 border-slate-600" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Age</label>
            <Input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Enter age" type="number" className="text-white bg-slate-700 border-slate-600" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-300">Contact</label>
            <Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Enter contact info" className="text-white bg-slate-700 border-slate-600" />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">Register Player</Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700">Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
