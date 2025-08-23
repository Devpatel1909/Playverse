import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../UI/card";
import { Button } from "../UI/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../UI/tabs";
import { Badge } from "../UI/badge";
import { Input } from "../UI/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../UI/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../UI/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../UI/table";
import { Separator } from "../UI/separator";
import { Popover, PopoverTrigger, PopoverContent } from "../UI/popover";
import { ScrollArea } from "../UI/scroll-area";
import { Play, Pause, RotateCcw, Users2, Radio, RefreshCcw, Plus, Minus, AlertTriangle, Trophy, Upload, Download, ArrowLeft } from "lucide-react";

// Minimal scaffolding so the page renders; replace with your full logic next.
export default function CricketLiveScoringUI() {
  const navigate = useNavigate();
  const [title] = useState("Spoural '25 — Cricket League");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-20 border-b backdrop-blur bg-white/70">
        <div className="flex items-center justify-between max-w-6xl gap-3 px-4 py-3 mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}> 
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="grid font-bold text-white size-9 rounded-2xl bg-slate-900 place-items-center">S</div>
            <div>
              <div className="text-lg font-semibold leading-tight">Spoural — Live Scoring</div>
              <div className="text-xs text-slate-500">Cricket • Frontend-only demo</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 rounded-xl">
              <Radio className="mr-1 h-3.5 w-3.5" /> LIVE
            </Badge>
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" /> Undo
            </Button>
          </div>
        </div>
      </header>

      <main className="grid max-w-6xl gap-6 px-4 py-6 mx-auto">
        <Card className="shadow-sm rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">{title}</CardTitle>
            <div className="text-sm text-slate-500">LDCE Ground, Ahmedabad • {new Date().toLocaleString()}</div>
          </CardHeader>
          <CardContent>
            <div className="grid items-center gap-4 md:grid-cols-3">
              <div className="text-center text-slate-500">Live scoring UI scaffold</div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="commentary" className="rounded-2xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="commentary">Commentary</TabsTrigger>
            <TabsTrigger value="lineups">Line-ups</TabsTrigger>
            <TabsTrigger value="info">Match Info</TabsTrigger>
          </TabsList>
          <TabsContent value="commentary">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Ball-by-ball</CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600">No deliveries yet.</div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lineups">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Playing XIs</CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600">Add players here…</div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="info">
            <Card className="rounded-2xl">
              <CardHeader><CardTitle>Match Information</CardTitle></CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600">Venue, toss, etc.</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="py-6 text-xs text-center text-slate-500">
          © {new Date().getFullYear()} Spoural • Frontend demo.
        </footer>
      </main>
    </div>
  );
}
