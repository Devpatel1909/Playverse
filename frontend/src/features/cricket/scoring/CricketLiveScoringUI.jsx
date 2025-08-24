import React, { useState, useEffect } from "react";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../UI/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../UI/select";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../UI/Card";
import { Badge } from "../UI/badge";
import { Label } from "../UI/label";


export default function TeamPage() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("superadmin_team_squad");
    if (saved) setPlayers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("superadmin_team_squad", JSON.stringify(players));
  }, [players]);

  const handleAddOrUpdate = (player) => {
    if (editingPlayer !== null) {
      setPlayers(players.map((p, i) => (i === editingPlayer ? player : p)));
      setEditingPlayer(null);
    } else {
      setPlayers([...players, player]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (i) => setPlayers(players.filter((_, idx) => idx !== i));
  const handleClone = (i) => setPlayers([...players, { ...players[i], name: players[i].name + " (Clone)" }]);




  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(players);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setPlayers(reordered);
  };

  const filtered = players
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (filterRole === "all" ? true : p.role === filterRole))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "jersey") return a.jersey - b.jersey;
      if (sortBy === "role") return a.role.localeCompare(b.role);
      return 0;
    });

  const roleCounts = players.reduce(
    (acc, p) => {
      acc[p.role] = (acc[p.role] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Team Squad Management</h1>

      {/* Summary */}
      <Card className="bg-gray-50">
        <CardHeader><CardTitle>Squad Summary</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {Object.entries(roleCounts).map(([role, count]) => (
            <Badge key={role} variant="secondary">{role}: {count}</Badge>
          ))}
          <Badge variant="outline">Total: {players.length}/15</Badge>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search player..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>

        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Batsman">Batsman</SelectItem>
            <SelectItem value="Bowler">Bowler</SelectItem>
            <SelectItem value="All-rounder">All-rounder</SelectItem>
            <SelectItem value="Wicket-keeper">Wicket Keeper</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Sort By" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="jersey">Jersey</SelectItem>
            <SelectItem value="role">Role</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setIsDialogOpen(true)}>+ Add Player</Button>
        
      </div>

      {/* Player List with Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="players">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="grid gap-3 md:grid-cols-2">
              {filtered.map((player, index) => (
                <Draggable key={index} draggableId={index.toString()} index={index}>
                  {(prov) => (
                    <Card ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="transition hover:shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {player.name}
                          <div className="flex gap-1">
                            {player.captain && <Badge variant="default">C</Badge>}
                            {player.viceCaptain && <Badge variant="secondary">VC</Badge>}
                            {player.wicketKeeper && <Badge variant="outline">WK</Badge>}
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p>Role: {player.role}</p>
                        <p>Jersey: {player.jersey}</p>
                        {player.photo && <img src={player.photo} alt="player" className="w-16 h-16 rounded-full" />}
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" onClick={() => { setEditingPlayer(index); setIsDialogOpen(true); }}>Edit</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(index)}>Delete</Button>
                          <Button size="sm" variant="outline" onClick={() => handleClone(index)}>Clone</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Dialog for Add/Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingPlayer !== null ? "Edit Player" : "Add Player"}</DialogTitle></DialogHeader>
          <PlayerForm onSubmit={handleAddOrUpdate} initial={editingPlayer !== null ? players[editingPlayer] : null} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlayerForm({ onSubmit, initial }) {
  const [form, setForm] = useState(initial || { name: "", role: "Batsman", jersey: "", captain: false, viceCaptain: false, wicketKeeper: false, photo: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setForm({ ...form, photo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-3"
    >
      <div>
        <Label>Name</Label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <Label>Role</Label>
        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
          <option>Batsman</option>
          <option>Bowler</option>
          <option>All-rounder</option>
          <option>Wicket-keeper</option>
        </select>
      </div>
      <div>
        <Label>Jersey Number</Label>
        <Input type="number" name="jersey" value={form.jersey} onChange={handleChange} required />
      </div>
      <div className="flex gap-3">
        <label><input type="checkbox" checked={form.captain} onChange={(e) => setForm({ ...form, captain: e.target.checked })} /> Captain</label>
        <label><input type="checkbox" checked={form.viceCaptain} onChange={(e) => setForm({ ...form, viceCaptain: e.target.checked })} /> Vice Captain</label>
        <label><input type="checkbox" checked={form.wicketKeeper} onChange={(e) => setForm({ ...form, wicketKeeper: e.target.checked })} /> WK</label>
      </div>
      <div>
        <Label>Photo</Label>
        <Input type="file" accept="image/*" onChange={handleFile} />
        {form.photo && <img src={form.photo} alt="preview" className="w-16 h-16 mt-2 rounded-full" />}
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
}