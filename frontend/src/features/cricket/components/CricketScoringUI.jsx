import React, { useCallback, useEffect, useMemo, useState } from "react";
import cricketAPIService from "../../../services/cricketAPI";

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Separator } from "../../../components/ui/separator";
import { Popover, PopoverTrigger, PopoverContent } from "../../../components/ui/popover";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { RotateCcw, Radio, AlertTriangle } from "lucide-react";

// Utilities
const uid = () => Math.random().toString(36).slice(2, 9);

const formatOvers = (deliveries) => {
  const legal = deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
  const overs = Math.floor(legal / 6);
  const balls = legal % 6;
  return `${overs}.${balls}`;
};

const calcRR = (runs, deliveries) => {
  const legal = deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
  const overs = legal / 6;
  return overs === 0 ? 0 : parseFloat((runs / overs).toFixed(2));
};

const swapStrikeIfNeeded = (strikerId, nonStrikerId, runs, type) => {
  const isOdd = runs % 2 === 1;
  const isLegal = type !== "WIDE" && type !== "NOBALL";
  if (!isLegal) return { strikerId, nonStrikerId };
  if (isOdd) return { strikerId: nonStrikerId, nonStrikerId: strikerId };
  return { strikerId, nonStrikerId };
};

const endOfOverSwap = (strikerId, nonStrikerId, type, deliveries) => {
  const legalThisOver = deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length % 6;
  if (legalThisOver === 0 && type !== "WIDE" && type !== "NOBALL") {
    return { strikerId: nonStrikerId, nonStrikerId: strikerId };
  }
  return { strikerId, nonStrikerId };
};

// Demo Seed Data
const demoPlayersA = [
  { id: uid(), name: "A. Shah (C)", role: "BAT" },
  { id: uid(), name: "R. Joshi", role: "BAT" },
  { id: uid(), name: "M. Patel", role: "BAT" },
  { id: uid(), name: "D. Kumar", role: "AR" },
  { id: uid(), name: "S. Iyer (WK)", role: "WK" },
  { id: uid(), name: "V. Rao", role: "AR" },
  { id: uid(), name: "H. Mehta", role: "BAT" },
  { id: uid(), name: "T. Singh", role: "BOWL" },
  { id: uid(), name: "P. Verma", role: "BOWL" },
  { id: uid(), name: "J. Parmar", role: "BOWL" },
  { id: uid(), name: "K. Jain", role: "BOWL" },
];

const demoPlayersB = [
  { id: uid(), name: "Z. Khan (C)", role: "AR" },
  { id: uid(), name: "L. Desai", role: "BAT" },
  { id: uid(), name: "B. Rana", role: "BAT" },
  { id: uid(), name: "U. Makwana", role: "BAT" },
  { id: uid(), name: "Q. Singh (WK)", role: "WK" },
  { id: uid(), name: "C. Sharma", role: "AR" },
  { id: uid(), name: "N. Modi", role: "AR" },
  { id: uid(), name: "R. Chawla", role: "BOWL" },
  { id: uid(), name: "I. Trivedi", role: "BOWL" },
  { id: uid(), name: "Y. Shah", role: "BOWL" },
  { id: uid(), name: "G. Ghosh", role: "BOWL" },
];

const seedMatch = {
  id: uid(),
  title: "Spoural '25 — Cricket League",
  venue: "LDCE Ground, Ahmedabad",
  startTimeISO: new Date().toISOString(),
  status: "LIVE",
  teams: [
    { name: "CE Titans", players: demoPlayersA },
    { name: "IT Falcons", players: demoPlayersB },
  ],
  toss: { winner: "CE Titans", elected: "BAT" },
  innings: [
    {
      battingTeam: "CE Titans",
      bowlingTeam: "IT Falcons",
      oversLimit: 20,
      deliveries: [],
      wickets: 0,
      total: 0,
      strikerId: demoPlayersA[0].id,
      nonStrikerId: demoPlayersA[1].id,
      bowlerId: demoPlayersB[10].id,
      oversBowled: 0,
    },
  ],
  currentInningsIndex: 0,
};

// Subcomponents
function TeamStrip({ name, score, wickets, overs, right, muted = false }) {
  return (
    <div className={`flex items-center ${right ? "justify-end" : "justify-start"} gap-4`}>
      {!right && <div className="text-lg font-semibold truncate md:text-xl">{name}</div>}
      <div className={`px-4 py-2 rounded-2xl shadow-sm border ${muted ? "bg-slate-50 text-slate-400" : "bg-white"}`}>
        <div className="text-2xl font-bold tabular-nums">{score}/{wickets}</div>
        <div className="text-xs text-slate-500">{overs} ov</div>
      </div>
      {right && <div className="text-lg font-semibold text-right truncate md:text-xl">{name}</div>}
    </div>
  );
}

function ScoreStrip({ total, wickets, overs, rr }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-4xl font-extrabold tabular-nums">{total}/{wickets}</div>
          <div className="text-sm text-slate-600">Overs: <span className="font-semibold">{overs}</span></div>
          <div className="text-sm text-slate-600">CRR: <span className="font-semibold">{rr}</span></div>
        </div>
      </CardContent>
    </Card>
  );
}

function OverProgress({ deliveries }) {
  const legal = deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL");
  const ballsInCurrentOver = legal.length % 6;

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-0"><CardTitle>Over Progress</CardTitle></CardHeader>
      <CardContent className="pt-3">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => {
            const d = legal.slice(-(ballsInCurrentOver || 6))[i];
            const isFilled = i < ballsInCurrentOver;
            const label = d ? (d.type === "WICKET" ? "W" : d.batsmanRuns) : "";
            return (
              <div key={i} className={`w-10 h-10 rounded-xl border grid place-items-center text-sm tabular-nums ${isFilled ? "bg-slate-900 text-white" : "bg-white"}`}>
                {isFilled ? label : ""}
              </div>
            );
          })}
        </div>
        <div className="mt-3 text-xs text-slate-500">Shows legal balls in current over. Extras do not fill circles.</div>
      </CardContent>
    </Card>
  );
}

function BattingTable({ deliveries, players, strikerId, nonStrikerId }) {
  const stats = useMemo(() => {
    const map = new Map();
    players.forEach((p) => map.set(p.id, { runs: 0, balls: 0, fours: 0, sixes: 0, out: false }));
    deliveries.forEach((d) => {
      const stats = map.get(d.strikerId);
      if (stats) {
        if (d.type !== "WIDE" && d.type !== "NOBALL") {
          stats.balls += 1;
        }
        stats.runs += d.batsmanRuns;
        if (d.batsmanRuns === 4) stats.fours += 1;
        if (d.batsmanRuns === 6) stats.sixes += 1;
        if (d.type === "WICKET") stats.out = true;
      }
    });
    return map;
  }, [deliveries, players]);

  const renderRow = (p) => {
    const s = stats.get(p.id);
    if (!s) return null;
    const sr = s.balls ? ((s.runs / s.balls) * 100).toFixed(1) : "0.0";
    const isOnStrike = p.id === strikerId || p.id === nonStrikerId;
    return (
      <TableRow key={p.id} className={isOnStrike ? "bg-slate-50" : ""}>
        <TableCell className="font-medium">
          {p.name}
          {p.id === strikerId && <Badge className="ml-2">•</Badge>}
          {p.id === nonStrikerId && <Badge className="ml-2" variant="secondary">•</Badge>}
        </TableCell>
        <TableCell className="text-right tabular-nums">{s.runs}</TableCell>
        <TableCell className="text-right tabular-nums">{s.balls}</TableCell>
        <TableCell className="text-right tabular-nums">{s.fours}</TableCell>
        <TableCell className="text-right tabular-nums">{s.sixes}</TableCell>
        <TableCell className="text-right tabular-nums">{sr}</TableCell>
        <TableCell className="text-right">{s.out ? "Out" : "Not out"}</TableCell>
      </TableRow>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Batsman</TableHead>
          <TableHead className="text-right">R</TableHead>
          <TableHead className="text-right">B</TableHead>
          <TableHead className="text-right">4s</TableHead>
          <TableHead className="text-right">6s</TableHead>
          <TableHead className="text-right">SR</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.slice(0, 11).map((p) => renderRow(p))}
      </TableBody>
    </Table>
  );
}

function BowlingTable({ deliveries, players, currentBowlerId }) {
  const stats = useMemo(() => {
    const map = new Map();
    players.forEach((p) => map.set(p.id, { ov: 0, runs: 0, wkts: 0, maidens: 0, balls: 0, dots: 0 }));
    
    const groupedByOver = new Map();
    deliveries.forEach((d) => {
      const stats = map.get(d.bowlerId);
      if (!stats) return;
      stats.runs += d.runs;
      if (d.type !== "WIDE" && d.type !== "NOBALL") {
        stats.balls += 1;
      }
      if (d.type === "WICKET") stats.wkts += 1;
      if (d.batsmanRuns === 0 && d.type !== "WIDE" && d.type !== "NOBALL") stats.dots += 1;
      
      const list = groupedByOver.get(d.over) || [];
      list.push(d);
      groupedByOver.set(d.over, list);
    });
    groupedByOver.forEach((balls) => {
      const bowlerId = balls[0]?.bowlerId;
      if (!bowlerId) return;
      const s = map.get(bowlerId);
      if (!s) return;
      const legalRuns = balls.reduce((acc, d) => acc + (d.type === "WIDE" || d.type === "NOBALL" ? 0 : d.runs), 0);
      const isMaiden = legalRuns === 0;
      if (isMaiden) s.maidens += 1;
    });
    players.forEach((p) => {
      const s = map.get(p.id);
      if (!s) return;
      s.ov = Math.floor(s.balls / 6) + (s.balls % 6) / 10;
    });
    return map;
  }, [deliveries, players]);

  const renderRow = (p) => {
    const s = stats.get(p.id);
    if (!s) return null;
    const eco = s.balls ? (s.runs / (s.balls / 6)).toFixed(2) : "0.00";
    const isCurrent = p.id === currentBowlerId;
    return (
      <TableRow key={p.id} className={isCurrent ? "bg-slate-50" : ""}>
        <TableCell className="font-medium">
          {p.name} {isCurrent && <Badge className="ml-2">(current)</Badge>}
        </TableCell>
        <TableCell className="text-right tabular-nums">{s.ov.toFixed(1)}</TableCell>
        <TableCell className="text-right tabular-nums">{s.maidens}</TableCell>
        <TableCell className="text-right tabular-nums">{s.runs}</TableCell>
        <TableCell className="text-right tabular-nums">{s.wkts}</TableCell>
        <TableCell className="text-right tabular-nums">{eco}</TableCell>
        <TableCell className="text-right tabular-nums">{s.dots}</TableCell>
      </TableRow>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bowler</TableHead>
          <TableHead className="text-right">O</TableHead>
          <TableHead className="text-right">M</TableHead>
          <TableHead className="text-right">R</TableHead>
          <TableHead className="text-right">W</TableHead>
          <TableHead className="text-right">Econ</TableHead>
          <TableHead className="text-right">Dots</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.slice(0, 11).map((p) => renderRow(p))}
      </TableBody>
    </Table>
  );
}

const Commentary = ({ deliveries, players }) => {
  const name = (id) => players.find((p) => p.id === id)?.name || "—";
  const items = [...deliveries].reverse();

  return (
    <ScrollArea className="pr-2 h-72">
      <ul className="grid gap-2">
        {items.map((d) => (
          <li key={d.id} className="flex items-start gap-3">
            <Badge variant="secondary" className="rounded-xl">
              {d.over}.{d.ball + 1}
            </Badge>
            <div className="flex-1">
              <div className="text-sm">
                {name(d.strikerId)} vs {name(d.bowlerId)} — {d.type === "WICKET" ? "WICKET!" : `${d.runs} run(s)`}
                {d.batsmanRuns !== d.runs && d.type !== "WICKET" ? ` (${d.batsmanRuns} to batsman)` : ""}
              </div>
              {d.notes && <div className="text-xs text-slate-500">{d.notes}</div>}
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
};

const LineupCard = ({ title, players }) => {
  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 text-sm">
          {players.slice(0, 11).map((p, idx) => (
            <li key={p.id} className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-5 text-slate-400">{idx + 1}.</span>
                {p.name}
              </span>
              <Badge variant="outline">{p.role}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const ScorerPanel = ({ 
  striker, 
  nonStriker, 
  bowler, 
  ballsInOver, 
  onScore, 
  onWicket, 
  onWide, 
  onNoBall, 
  onBye, 
  onLegBye, 
  onChangeStriker, 
  onChangeBowler, 
  bowlingOptions,
  needBowlerSelection,
  needBatsmanSelection,
  onSelectNewBatsman,
  batsmanOptions
}) => {
  const [note, setNote] = useState("");
  const [wicketOpen, setWicketOpen] = useState(false);
  const [dismissalNote, setDismissalNote] = useState("");
  const [selectedBowler, setSelectedBowler] = useState(undefined);
  const [byesOpen, setByesOpen] = useState(false);
  const [legByesOpen, setLegByesOpen] = useState(false);
  const [bowlerSelectOpen, setBowlerSelectOpen] = useState(false);
  const [batsmanSelectOpen, setBatsmanSelectOpen] = useState(false);

  useEffect(() => {
    if (needBowlerSelection) {
      setBowlerSelectOpen(true);
    }
  }, [needBowlerSelection]);

  useEffect(() => {
    if (needBatsmanSelection) {
      setBatsmanSelectOpen(true);
    }
  }, [needBatsmanSelection]);

  useEffect(() => {
    if (selectedBowler) onChangeBowler(selectedBowler);
  }, [selectedBowler, onChangeBowler]);

  return (
    <Card className="rounded-2xl sticky top-[84px] shadow-lg border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Scoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bowler Selection Dialog */}
        <Dialog open={bowlerSelectOpen} onOpenChange={setBowlerSelectOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Select New Bowler</DialogTitle>
              <DialogDescription>
                Choose the bowler for the next over
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="pr-3 h-60">
              <div className="space-y-2">
                {bowlingOptions.map((p) => (
                  <Button
                    key={p.id}
                    variant="outline"
                    className="justify-start w-full h-12 text-left"
                    onClick={() => {
                      setSelectedBowler(p.id);
                      setBowlerSelectOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{p.name}</span>
                      <Badge variant="secondary">{p.role}</Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* New Batsman Selection Dialog */}
        <Dialog open={batsmanSelectOpen} onOpenChange={setBatsmanSelectOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Select New Batsman</DialogTitle>
              <DialogDescription>
                A wicket has fallen. Choose the next batsman.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="pr-3 h-60">
              <div className="space-y-2">
                {batsmanOptions && batsmanOptions.map((p) => (
                  <Button
                    key={p.id}
                    variant="outline"
                    className="justify-start w-full h-12 text-left"
                    onClick={() => {
                      onSelectNewBatsman(p.id);
                      setBatsmanSelectOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{p.name}</span>
                      <Badge variant="secondary">{p.role}</Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Current Players Info */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-600">Striker</span>
            <Badge className="bg-green-600">{striker}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-600">Non-Striker</span>
            <Badge variant="secondary">{nonStriker}</Badge>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-600">Bowler</span>
            <Badge variant="outline">{bowler}</Badge>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold tracking-wide uppercase text-slate-600">This Over</span>
            <Badge variant="outline" className="font-mono text-sm tabular-nums">
              {ballsInOver}/6
            </Badge>
          </div>
        </div>

        {/* Quick Runs Section */}
        <div className="space-y-2">
          <h4 className="px-1 text-xs font-bold tracking-wider uppercase text-slate-700">Quick Score</h4>
          <div className="grid grid-cols-7 gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map((r) => (
              <Button 
                key={r} 
                onClick={() => onScore(r, "LEGAL", note)} 
                variant={r === 0 ? "outline" : r === 4 ? "default" : r === 6 ? "default" : "outline"}
                className={`h-14 rounded-xl font-bold text-lg transition-all hover:scale-105 ${
                  r === 4 ? "bg-blue-600 hover:bg-blue-700" : 
                  r === 6 ? "bg-purple-600 hover:bg-purple-700" : ""
                }`}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        {/* Extras Section */}
        <div className="space-y-2">
          <h4 className="px-1 text-xs font-bold tracking-wider uppercase text-slate-700">Extras</h4>
          <div className="grid grid-cols-2 gap-1">
            <Button 
              variant="outline" 
              onClick={() => onWide(1)} 
              className="text-sm font-semibold text-yellow-700 border-yellow-500 h-11 rounded-xl hover:bg-yellow-50"
            >
              Wide
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNoBall(0)} 
              className="text-sm font-semibold text-orange-700 border-orange-500 h-11 rounded-xl hover:bg-orange-50"
            >
              No Ball
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setByesOpen(true)}
              className="text-sm font-semibold h-11 rounded-xl border-slate-300 hover:bg-slate-50"
            >
              Byes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLegByesOpen(true)}
              className="text-sm font-semibold h-11 rounded-xl border-slate-300 hover:bg-slate-50"
            >
              Leg Byes
            </Button>
          </div>
        </div>

        {/* Byes Dialog */}
        <Dialog open={byesOpen} onOpenChange={setByesOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Byes</DialogTitle>
              <DialogDescription>Choose the number of bye runs</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-3 py-4">
              {[1, 2, 3, 4].map((r) => (
                <Button 
                  key={r} 
                  onClick={() => {
                    onBye(r);
                    setByesOpen(false);
                  }} 
                  className="h-16 text-xl font-bold rounded-xl"
                >
                  {r}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Leg Byes Dialog */}
        <Dialog open={legByesOpen} onOpenChange={setLegByesOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Leg Byes</DialogTitle>
              <DialogDescription>Choose the number of leg bye runs</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-3 py-4">
              {[1, 2, 3, 4].map((r) => (
                <Button 
                  key={r} 
                  onClick={() => {
                    onLegBye(r);
                    setLegByesOpen(false);
                  }} 
                  className="h-16 text-xl font-bold rounded-xl"
                >
                  {r}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Wicket Section */}
        <div className="space-y-2">
          <h4 className="px-1 text-xs font-bold tracking-wider uppercase text-slate-700">Wicket</h4>
          <Button 
            variant="destructive" 
            className="w-full h-12 text-base font-bold transition-all shadow-md rounded-xl hover:shadow-lg" 
            onClick={() => setWicketOpen(true)}
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            WICKET
          </Button>
          <Dialog open={wicketOpen} onOpenChange={setWicketOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Record Wicket</DialogTitle>
                <DialogDescription>
                  Add dismissal details (e.g., bowled, caught, lbw)
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <Input 
                  placeholder="How was the batsman dismissed?" 
                  value={dismissalNote} 
                  onChange={(e) => setDismissalNote(e.target.value)}
                  className="h-11"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setWicketOpen(false)} className="rounded-lg">
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    onWicket(dismissalNote);
                    setDismissalNote("");
                    setWicketOpen(false);
                  }}
                  className="rounded-lg"
                >
                  Confirm Wicket
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Separator />

        {/* Commentary Note */}
        <div className="space-y-2">
          <h4 className="px-1 text-xs font-bold tracking-wider uppercase text-slate-700">Commentary Note</h4>
          <Input 
            placeholder="Add commentary for this ball..." 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            className="h-10 text-sm rounded-xl"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button 
            variant="outline" 
            onClick={onChangeStriker} 
            className="font-semibold border-2 h-11 rounded-xl hover:bg-indigo-50 hover:border-indigo-500 hover:text-indigo-700"
          >
            Rotate Strike
          </Button>
          <Button 
            variant="outline" 
            onClick={() => alert("Next over (manual bowler change)")} 
            className="font-semibold border-2 h-11 rounded-xl hover:bg-green-50 hover:border-green-500 hover:text-green-700"
          >
            End Over
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Core Component
const CricketLiveScoringUI = ({ initialMatch, matchId }) => {
  const [match, setMatch] = useState(initialMatch || seedMatch);
  const [isSyncing, setIsSyncing] = useState(false);
  const current = match.innings[match.currentInningsIndex];

  // Auto-save to database whenever match state changes
  useEffect(() => {
    const syncToDatabase = async () => {
      if (!matchId || isSyncing) return;
      
      try {
        setIsSyncing(true);
        
        const scoreData = {
          teamA: {
            runs: current.total,
            wickets: current.wickets
          },
          teamB: {
            runs: 0,
            wickets: 0
          },
          overs: formatOvers(current.deliveries),
          status: 'live'
        };

        console.log('[CricketScoringUI] Syncing score to database:', scoreData);
        await cricketAPIService.updateMatchScore(matchId, scoreData);
        console.log('[CricketScoringUI] Score synced successfully');
      } catch (error) {
        console.error('[CricketScoringUI] Failed to sync score:', error);
      } finally {
        setIsSyncing(false);
      }
    };

    // Debounce sync to avoid too many requests
    const timeoutId = setTimeout(syncToDatabase, 1000);
    return () => clearTimeout(timeoutId);
  }, [match, matchId, current, isSyncing]);

  const striker = useMemo(
    () => match.teams.flatMap((t) => t.players).find((p) => p.id === current.strikerId) || null,
    [match, current.strikerId]
  );

  const nonStriker = useMemo(
    () => match.teams.flatMap((t) => t.players).find((p) => p.id === current.nonStrikerId) || null,
    [match, current.nonStrikerId]
  );

  const bowler = useMemo(
    () => match.teams.flatMap((t) => t.players).find((p) => p.id === current.bowlerId) || null,
    [match, current.bowlerId]
  );

  const legalBallsThisOver = useMemo(() => {
    const legal = current.deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL");
    const count = legal.length % 6;
    return count;
  }, [current.deliveries]);

  const handleBall = useCallback(
    (opts) => {
      if (!current.strikerId || !current.nonStrikerId || !current.bowlerId) {
        alert("Set striker/non-striker/bowler before scoring.");
        return;
      }

      const now = Date.now();
      const legalBefore = current.deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
      const over = Math.floor(legalBefore / 6);
      const ball = legalBefore % 6;
      const batsmanRuns = opts.bye || opts.legbye ? 0 : opts.runs;

      const del = {
        id: uid(),
        over,
        ball,
        runs: opts.runs + (opts.type === "NOBALL" ? 1 : 0) + (opts.type === "WIDE" ? 1 : 0),
        batsmanRuns,
        type: opts.type,
        notes: opts.notes,
        strikerId: current.strikerId,
        nonStrikerId: current.nonStrikerId,
        bowlerId: current.bowlerId || '',
        timestamp: now,
      };

      const nextDeliveries = [...current.deliveries, del];
      const total = nextDeliveries.reduce((acc, d) => acc + d.runs, 0);
      const wickets = nextDeliveries.filter((d) => d.type === "WICKET").length;

      let { strikerId, nonStrikerId } = swapStrikeIfNeeded(
        current.strikerId,
        current.nonStrikerId,
        del.batsmanRuns,
        del.type
      );

      const wasEndOfOver = endOfOverSwap(strikerId, nonStrikerId, del.type, nextDeliveries);
      strikerId = wasEndOfOver.strikerId;
      nonStrikerId = wasEndOfOver.nonStrikerId;

      // Check if over is complete
      const legalAfter = nextDeliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
      const isOverComplete = legalAfter % 6 === 0 && del.type !== "WIDE" && del.type !== "NOBALL";

      setMatch((prev) => {
        const copy = { ...prev };
        const inn = { ...copy.innings[copy.currentInningsIndex] };
        inn.deliveries = nextDeliveries;
        inn.total = total;
        inn.wickets = wickets;
        inn.strikerId = strikerId;
        inn.nonStrikerId = nonStrikerId;
        const legal = nextDeliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
        inn.oversBowled = Math.floor(legal / 6);
        
        // Mark that we need bowler selection after over
        inn.needBowlerSelection = isOverComplete;
        
        // Mark that we need batsman selection after wicket
        inn.needBatsmanSelection = del.type === "WICKET";
        
        copy.innings[copy.currentInningsIndex] = inn;
        return copy;
      });
    },
    [current]
  );

  const undoLast = useCallback(() => {
    setMatch((prev) => {
      const copy = { ...prev };
      const inn = { ...copy.innings[copy.currentInningsIndex] };
      if (inn.deliveries.length === 0) return prev;
      inn.deliveries = inn.deliveries.slice(0, -1);
      inn.total = inn.deliveries.reduce((a, d) => a + d.runs, 0);
      inn.wickets = inn.deliveries.filter((d) => d.type === "WICKET").length;

      const baseStriker = seedMatch.innings[0].strikerId || '';
      const baseNonStriker = seedMatch.innings[0].nonStrikerId || '';
      let s = baseStriker, n = baseNonStriker;
      inn.deliveries.forEach((d, idx) => {
        ({ strikerId: s, nonStrikerId: n } = swapStrikeIfNeeded(s, n, d.batsmanRuns, d.type));
        ({ strikerId: s, nonStrikerId: n } = endOfOverSwap(s, n, d.type, inn.deliveries.slice(0, idx + 1)));
      });
      inn.strikerId = s;
      inn.nonStrikerId = n;
      const legal = inn.deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
      inn.oversBowled = Math.floor(legal / 6);
      copy.innings[copy.currentInningsIndex] = inn;
      return copy;
    });
  }, []);

  const currentRR = calcRR(current.total, current.deliveries);
  const oversFmt = formatOvers(current.deliveries);

  // Get available batsmen (those who haven't batted yet)
  const getAvailableBatsmen = useCallback(() => {
    const battedIds = new Set();
    current.deliveries.forEach((d) => {
      battedIds.add(d.strikerId);
    });
    battedIds.add(current.strikerId);
    battedIds.add(current.nonStrikerId);
    
    return match.teams[0].players.filter((p) => !battedIds.has(p.id));
  }, [current, match.teams]);

  const handleSelectNewBatsman = useCallback((playerId) => {
    setMatch((prev) => {
      const copy = { ...prev };
      const inn = { ...copy.innings[copy.currentInningsIndex] };
      // Replace the striker (who got out) with the new batsman
      inn.strikerId = playerId;
      inn.needBatsmanSelection = false;
      copy.innings[copy.currentInningsIndex] = inn;
      return copy;
    });
  }, []);

  const handleChangeBowler = useCallback((playerId) => {
    setMatch((prev) => {
      const copy = { ...prev };
      const inn = { ...copy.innings[copy.currentInningsIndex] };
      inn.bowlerId = playerId;
      inn.needBowlerSelection = false;
      copy.innings[copy.currentInningsIndex] = inn;
      return copy;
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <header className="sticky top-0 z-20 border-b backdrop-blur bg-white/70">
        <div className="flex items-center justify-between max-w-full gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="grid font-bold text-white size-9 rounded-2xl bg-slate-900 place-items-center">S</div>
            <div>
              <div className="text-lg font-semibold leading-tight">Spoural — Live Scoring</div>
              <div className="text-xs text-slate-500">
                Cricket • {matchId ? 'Connected to Database' : 'Demo Mode'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-3 py-1 rounded-xl">
              <Radio className="mr-1 h-3.5 w-3.5" />
              LIVE
            </Badge>
            {isSyncing && (
              <Badge variant="outline" className="px-3 py-1 rounded-xl">
                <div className="w-2 h-2 mr-2 bg-blue-500 rounded-full animate-pulse"></div>
                Syncing...
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={undoLast}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Undo
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-full px-6 py-6">
        <div className="space-y-6">
          <Card className="shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{match.title}</CardTitle>
              <div className="text-sm text-slate-500">
                {match.venue} • {new Date(match.startTimeISO).toLocaleString()}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid items-center gap-4 md:grid-cols-3">
                <TeamStrip
                  name={match.teams[0].name}
                  right={false}
                  score={match.innings[0].total}
                  wickets={match.innings[0].wickets}
                  overs={oversFmt}
                />
                <div className="hidden text-center md:block text-slate-500">vs</div>
                <TeamStrip
                  name={match.teams[1].name}
                  right
                  score={0}
                  wickets={0}
                  overs={"0.0"}
                  muted
                />
              </div>
              <div className="mt-3 text-sm text-slate-600">
                Toss: {match.toss?.winner} elected to {match.toss?.elected === "BAT" ? "bat" : "bowl"}.
              </div>
            </CardContent>
          </Card>

          <div className="grid items-start gap-6 xl:grid-cols-4 lg:grid-cols-3">
            <div className="space-y-6 xl:col-span-3 lg:col-span-2">
              <ScoreStrip total={current.total} wickets={current.wickets} overs={oversFmt} rr={currentRR} />
              <OverProgress deliveries={current.deliveries} />

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Batting — {current.battingTeam}</CardTitle>
                </CardHeader>
                <CardContent>
                  <BattingTable
                    deliveries={current.deliveries}
                    players={match.teams[0].players}
                    strikerId={current.strikerId}
                    nonStrikerId={current.nonStrikerId}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Bowling — {current.bowlingTeam}</CardTitle>
                </CardHeader>
                <CardContent>
                  <BowlingTable
                    deliveries={current.deliveries}
                    players={match.teams[1].players}
                    currentBowlerId={current.bowlerId}
                  />
                </CardContent>
              </Card>

              <Tabs defaultValue="commentary" className="rounded-2xl">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="commentary">Commentary</TabsTrigger>
                  <TabsTrigger value="lineups">Line-ups</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                <TabsContent value="commentary">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Ball-by-ball</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Commentary
                        deliveries={current.deliveries}
                        players={[...match.teams[0].players, ...match.teams[1].players]}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="lineups">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Playing XIs</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                      <LineupCard title={match.teams[0].name} players={match.teams[0].players} />
                      <LineupCard title={match.teams[1].name} players={match.teams[1].players} />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="info">
                  <Card className="rounded-2xl">
                    <CardHeader>
                      <CardTitle>Match Info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm text-slate-600">
                      <div>Status: {match.status}</div>
                      <div>Overs limit: {current.oversLimit}</div>
                      <div>Current RR: {currentRR}</div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <ScorerPanel
                striker={striker?.name || "—"}
                nonStriker={nonStriker?.name || "—"}
                bowler={bowler?.name || "—"}
                ballsInOver={legalBallsThisOver}
                onScore={(runs, type, note) => handleBall({ runs, type, notes: note })}
                onWicket={(note) => handleBall({ runs: 0, type: "WICKET", notes: note })}
                onWide={(runs) => handleBall({ runs, type: "WIDE" })}
                onNoBall={(runs) => handleBall({ runs, type: "NOBALL" })}
                onBye={(runs) => handleBall({ runs, type: "BYE", bye: true })}
                onLegBye={(runs) => handleBall({ runs, type: "LEGBYE", legbye: true })}
                onChangeStriker={() =>
                  setMatch((prev) => {
                    const copy = { ...prev };
                    const inn = { ...copy.innings[copy.currentInningsIndex] };
                    [inn.strikerId, inn.nonStrikerId] = [inn.nonStrikerId, inn.strikerId];
                    copy.innings[copy.currentInningsIndex] = inn;
                    return copy;
                  })
                }
                onChangeBowler={handleChangeBowler}
                bowlingOptions={match.teams[1].players}
                needBowlerSelection={current.needBowlerSelection || false}
                needBatsmanSelection={current.needBatsmanSelection || false}
                onSelectNewBatsman={handleSelectNewBatsman}
                batsmanOptions={getAvailableBatsmen()}
              />

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => alert("Saved locally (demo)")}>
                    Save Snapshot
                  </Button>
                  <Button variant="outline" onClick={() => alert("Synced (mock)")}>
                    Sync
                  </Button>
                  <Button variant="ghost" onClick={() => alert("Export JSON coming soon")}>
                    Export JSON
                  </Button>
                  <Button variant="ghost" onClick={() => alert("Import JSON coming soon")}>
                    Import JSON
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 text-xs text-center border-t text-slate-500">
        © {new Date().getFullYear()} Spoural • {matchId ? 'Live scoring with database sync' : 'Demo mode'}
      </footer>
    </div>
  );
};

export default CricketLiveScoringUI