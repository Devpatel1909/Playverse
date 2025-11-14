import React, { useCallback, useEffect, useMemo, useState } from "react";
import cricketAPIService from "../../../services/cricketAPI";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
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

  // For wides - only the extra runs (beyond the 1 penalty) matter for strike change
  // Wide = 1 run (no change), Wide+1 = 2 runs (no change), Wide+2 = 3 runs (change)
  if (type === "WIDE") {
    // Subtract 1 (the penalty) to get actual runs taken
    const extraRuns = runs - 1;
    if (extraRuns % 2 === 1) return { strikerId: nonStrikerId, nonStrikerId: strikerId };
    return { strikerId, nonStrikerId };
  }

  // For byes and leg byes - total runs determine strike change
  if (type === "BYE" || type === "LEGBYE") {
    if (isOdd) return { strikerId: nonStrikerId, nonStrikerId: strikerId };
    return { strikerId, nonStrikerId };
  }

  // For no balls - runs off the bat determine strike change
  if (type === "NOBALL") {
    if (isOdd) return { strikerId: nonStrikerId, nonStrikerId: strikerId };
    return { strikerId, nonStrikerId };
  }

  // For legal balls - strike changes on odd runs
  if (isOdd) return { strikerId: nonStrikerId, nonStrikerId: strikerId };
  return { strikerId, nonStrikerId };
};

// Determine end-of-over swapping: if the ball just completed the over (i.e., legal ball count % 6 === 0),
// swap striker and non-striker.
const endOfOverSwap = (strikerId, nonStrikerId, deliveriesAfterThisBall) => {
  const legal = deliveriesAfterThisBall.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
  // If exactly an integer number of overs have been bowled, swap.
  if (legal > 0 && legal % 6 === 0) {
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

// Seed match
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
  toss: null, // Will be set via toss dialog
  innings: [
    // We store initialStrikerId and initialNonStrikerId so undo/replay can reconstruct state
    {
      battingTeam: "CE Titans",
      bowlingTeam: "IT Falcons",
      oversLimit: 20,
      deliveries: [],
      wickets: 0,
      total: 0,
      strikerId: demoPlayersA[0].id,
      nonStrikerId: demoPlayersA[1].id,
      initialStrikerId: demoPlayersA[0].id,
      initialNonStrikerId: demoPlayersA[1].id,
      bowlerId: demoPlayersB[10].id,
      oversBowled: 0,
      needBowlerSelection: false,
      needBatsmanSelection: false,
      complete: false,
    },
  ],
  currentInningsIndex: 0,
};

//
// --- Subcomponents (kept mostly unchanged) ---
//

function TeamStrip({ name, score, wickets, overs, right, muted = false }) {
  return (
    <div className={`flex items-center ${right ? "justify-end" : "justify-start"} gap-4`}>
      {!right && <div className="text-lg font-semibold text-gray-900 truncate md:text-xl">{name}</div>}
      <div className={`px-4 py-2 rounded-2xl shadow-sm border ${muted ? "bg-gray-50 text-gray-400 border-gray-300" : "bg-white text-gray-900 border-gray-900"}`}>
        <div className="text-2xl font-bold tabular-nums">{score}/{wickets}</div>
        <div className={`text-xs ${muted ? "text-gray-400" : "text-gray-600"}`}>{overs} ov</div>
      </div>
      {right && <div className="text-lg font-semibold text-right text-gray-900 truncate md:text-xl">{name}</div>}
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

  // Current over index
  const currentOverNum = Math.floor(legal.length / 6);
  const allInCurrentOver = deliveries.filter((d, i) => {
    const legalBefore = deliveries.slice(0, i).filter(dd => dd.type !== "WIDE" && dd.type !== "NOBALL").length;
    const overNum = Math.floor(legalBefore / 6);
    return overNum === currentOverNum;
  });

  return (
    <Card className="border-gray-300 rounded-2xl">
      <CardHeader className="pb-0"><CardTitle className="text-gray-900">Over Progress</CardTitle></CardHeader>
      <CardContent className="pt-3">
        <div className="flex flex-wrap gap-2">
          {allInCurrentOver.map((d, i) => {
            let label = "";
            let bgColor = "bg-gray-900 text-white border-gray-900";
            if (d.type === "WICKET") {
              label = "W";
              bgColor = "bg-red-600 text-white border-red-600";
            } else if (d.type === "WIDE") {
              label = d.runs > 1 ? `WD+${d.runs - 1}` : "WD";
              bgColor = "bg-orange-600 text-white border-orange-600";
            } else if (d.type === "NOBALL") {
              label = d.batsmanRuns > 0 ? `NB+${d.batsmanRuns}` : "NB";
              bgColor = "bg-red-600 text-white border-red-600";
            } else if (d.type === "BYE") {
              label = d.runs > 0 ? `B${d.runs}` : "B";
              bgColor = "bg-blue-600 text-white border-blue-600";
            } else if (d.type === "LEGBYE") {
              label = d.runs > 0 ? `LB${d.runs}` : "LB";
              bgColor = "bg-indigo-600 text-white border-indigo-600";
            } else {
              label = d.batsmanRuns;
            }

            return (
              <div key={i} className={`w-10 h-10 rounded-xl border-2 grid place-items-center text-xs font-bold tabular-nums ${bgColor}`}>
                {label}
              </div>
            );
          })}

          {Array.from({ length: Math.max(0, 6 - ballsInCurrentOver) }).map((_, i) => (
            <div key={`empty-${i}`} className="grid w-10 h-10 text-sm font-bold text-gray-400 bg-white border-2 border-gray-300 rounded-xl place-items-center tabular-nums">
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-600">
          <span className="font-semibold text-orange-600">WD</span> = Wide,&nbsp;
          <span className="font-semibold text-red-600"> NB</span> = No Ball,&nbsp;
          <span className="font-semibold text-blue-600"> B</span> = Byes,&nbsp;
          <span className="font-semibold text-indigo-600"> LB</span> = Leg Byes,&nbsp;
          <span className="font-semibold text-red-600"> W</span> = Wicket
        </div>
      </CardContent>
    </Card>
  );
}

function BattingTable({ deliveries, players, strikerId, nonStrikerId }) {
  const stats = useMemo(() => {
    const map = new Map();
    players.forEach((p) => map.set(p.id, { runs: 0, balls: 0, fours: 0, sixes: 0, out: false }));
    deliveries.forEach((d) => {
      const s = map.get(d.strikerId);
      if (s) {
        if (d.type !== "WIDE" && d.type !== "NOBALL") {
          s.balls += 1;
        }
        s.runs += d.batsmanRuns;
        if (d.batsmanRuns === 4) s.fours += 1;
        if (d.batsmanRuns === 6) s.sixes += 1;
        if (d.type === "WICKET") s.out = true;
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
      <TableRow key={p.id} className={isOnStrike ? "bg-gray-50" : ""}>
        <TableCell className="font-medium text-gray-900">
          {p.name}
          {p.id === strikerId && <Badge className="ml-2 text-white bg-gray-900 hover:bg-gray-800">•</Badge>}
          {p.id === nonStrikerId && <Badge className="ml-2 text-white bg-gray-400" variant="secondary">•</Badge>}
        </TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.runs}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.balls}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.fours}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.sixes}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{sr}</TableCell>
        <TableCell className="text-right text-gray-900">{s.out ? "Out" : "Not out"}</TableCell>
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
    players.forEach((p) => map.set(p.id, { ov: 0, runs: 0, wkts: 0, maidens: 0, balls: 0, dots: 0, wides: 0, noBalls: 0 }));

    // group deliveries by over and bowler
    const groupedByOver = new Map();

    deliveries.forEach((d) => {
      const s = map.get(d.bowlerId);
      if (!s) return;
      s.runs += d.runs;
      if (d.type !== "WIDE" && d.type !== "NOBALL") {
        s.balls += 1;
      }
      if (d.type === "WICKET") s.wkts += 1;
      if (d.batsmanRuns === 0 && d.type !== "WIDE" && d.type !== "NOBALL") s.dots += 1;

      // Track wides and no balls
      if (d.type === "WIDE") s.wides += 1;
      if (d.type === "NOBALL") s.noBalls += 1;

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
    const extras = s.wides + s.noBalls;

    return (
      <TableRow key={p.id} className={isCurrent ? "bg-gray-50" : ""}>
        <TableCell className="font-medium text-gray-900">
          {p.name} {isCurrent && <Badge className="ml-2 text-white bg-gray-900 hover:bg-gray-800">(current)</Badge>}
        </TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.ov.toFixed(1)}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.maidens}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.runs}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.wkts}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{eco}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.dots}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.wides}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{s.noBalls}</TableCell>
        <TableCell className="text-right text-gray-900 tabular-nums">{extras}</TableCell>
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
          <TableHead className="text-right">WD</TableHead>
          <TableHead className="text-right">NB</TableHead>
          <TableHead className="text-right">Ex</TableHead>
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
            <Badge variant="secondary" className="text-white bg-gray-900 rounded-xl">
              {d.over}.{d.ball + 1}
            </Badge>
            <div className="flex-1">
              <div className="text-sm text-gray-900">
                {name(d.strikerId)} vs {name(d.bowlerId)} — {d.type === "WICKET" ? "WICKET!" : `${d.runs} run(s)`}
                {d.batsmanRuns !== d.runs && d.type !== "WICKET" ? ` (${d.batsmanRuns} to batsman)` : ""}
              </div>
              {d.notes && <div className="text-xs text-gray-600">{d.notes}</div>}
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
};

const LineupCard = ({ title, players }) => {
  return (
    <Card className="border-gray-300 rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-2 text-sm">
          {players.slice(0, 11).map((p, idx) => (
            <li key={p.id} className="flex items-center justify-between text-gray-900">
              <span className="flex items-center gap-2">
                <span className="w-5 text-gray-500">{idx + 1}.</span>
                {p.name}
              </span>
              <Badge variant="outline" className="text-gray-900 border-gray-400">{p.role}</Badge>
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
  const [byesOpen, setByesOpen] = useState(false);
  const [legByesOpen, setLegByesOpen] = useState(false);
  const [wideOpen, setWideOpen] = useState(false);
  const [noBallOpen, setNoBallOpen] = useState(false);
  const [bowlerSelectOpen, setBowlerSelectOpen] = useState(false);
  const [batsmanSelectOpen, setBatsmanSelectOpen] = useState(false);
  const [selectedBowler, setSelectedBowler] = useState(undefined);

  useEffect(() => {
    if (needBowlerSelection) setBowlerSelectOpen(true);
  }, [needBowlerSelection]);

  useEffect(() => {
    if (needBatsmanSelection) setBatsmanSelectOpen(true);
  }, [needBatsmanSelection]);

  useEffect(() => {
    if (selectedBowler) onChangeBowler(selectedBowler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBowler]);

  return (
    <Card className="rounded-2xl sticky top-[84px] shadow-lg border-2 border-gray-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
          <div className="w-2 h-2 bg-gray-900 rounded-full animate-pulse"></div>
          Live Scoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bowler Selection Dialog */}
        <Dialog open={bowlerSelectOpen} onOpenChange={setBowlerSelectOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Select New Bowler</DialogTitle>
              <DialogDescription>Choose the bowler for the next over</DialogDescription>
            </DialogHeader>
            <ScrollArea className="pr-3 h-60">
              <div className="space-y-2">
                {bowlingOptions.map((p) => (
                  <Button
                    key={p.id}
                    variant="outline"
                    className="justify-start w-full h-12 text-left text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white"
                    onClick={() => { setSelectedBowler(p.id); setBowlerSelectOpen(false); }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{p.name}</span>
                      <Badge variant="secondary" className="text-gray-900 bg-gray-200">{p.role}</Badge>
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
              <DialogDescription>A wicket has fallen. Choose the next batsman.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="pr-3 h-60">
              <div className="space-y-2">
                {batsmanOptions && batsmanOptions.map((p) => (
                  <Button
                    key={p.id}
                    variant="outline"
                    className="justify-start w-full h-12 text-left text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white"
                    onClick={() => { onSelectNewBatsman(p.id); setBatsmanSelectOpen(false); }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{p.name}</span>
                      <Badge variant="secondary" className="text-gray-900 bg-gray-200">{p.role}</Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 space-y-2.5 border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-gray-700 uppercase">Striker</span>
            <Badge className="text-white bg-gray-900 hover:bg-gray-800">{striker}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-gray-700 uppercase">Non-Striker</span>
            <Badge className="text-white bg-gray-500 hover:bg-gray-600" variant="secondary">{nonStriker}</Badge>
          </div>
          <Separator className="my-2 bg-gray-300" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-gray-700 uppercase">Bowler</span>
            <Badge variant="outline" className="text-gray-900 border-gray-400">{bowler}</Badge>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-semibold tracking-wide text-gray-700 uppercase">This Over</span>
            <Badge variant="outline" className="font-mono text-sm text-gray-900 border-gray-400 tabular-nums">
              {ballsInOver}/6
            </Badge>
          </div>
        </div>

        {/* Quick Runs Section */}
        <div className="space-y-2">
          <h4 className="px-1 text-xs font-bold tracking-wider text-gray-700 uppercase">Quick Score</h4>
          <div className="grid grid-cols-7 gap-1">
            {[0, 1, 2, 3, 4, 5, 6].map((r) => (
              <Button
                key={r}
                onClick={() => onScore(r, "LEGAL", note)}
                variant="outline"
                className="text-lg font-bold text-gray-900 transition-all bg-white border-2 border-gray-900 h-14 rounded-xl hover:scale-105 hover:bg-gray-900 hover:text-white"
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        {/* Extras Section */}
        <div className="space-y-2">
          <h4 className="px-1 text-xs font-bold tracking-wider text-gray-700 uppercase">Extras</h4>
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant="outline"
              onClick={() => setWideOpen(true)}
              className="text-sm font-semibold text-gray-900 bg-white border-2 border-gray-900 h-11 rounded-xl hover:bg-gray-900 hover:text-white"
            >
              Wide
            </Button>
            <Button
              variant="outline"
              onClick={() => setNoBallOpen(true)}
              className="text-sm font-semibold text-gray-900 bg-white border-2 border-gray-900 h-11 rounded-xl hover:bg-gray-900 hover:text-white"
            >
              No Ball
            </Button>
            <Button
              variant="outline"
              onClick={() => setByesOpen(true)}
              className="text-sm font-semibold text-gray-900 bg-white border-2 border-gray-900 h-11 rounded-xl hover:bg-gray-900 hover:text-white"
            >
              Byes
            </Button>
            <Button
              variant="outline"
              onClick={() => setLegByesOpen(true)}
              className="text-sm font-semibold text-gray-900 bg-white border-2 border-gray-900 h-11 rounded-xl hover:bg-gray-900 hover:text-white"
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
                  onClick={() => { onBye(r); setByesOpen(false); }}
                  className="h-16 text-xl font-bold text-gray-900 bg-white border-2 border-gray-900 rounded-xl hover:bg-gray-900 hover:text-white"
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
                  onClick={() => { onLegBye(r); setLegByesOpen(false); }}
                  className="h-16 text-xl font-bold text-gray-900 bg-white border-2 border-gray-900 rounded-xl hover:bg-gray-900 hover:text-white"
                >
                  {r}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Wide Dialog */}
        <Dialog open={wideOpen} onOpenChange={setWideOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-orange-600">Wide Ball</DialogTitle>
              <DialogDescription>Choose additional runs scored (1 run for wide is automatic)</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-5 gap-3 py-4">
              {[0, 1, 2, 3, 4].map((r) => (
                <Button
                  key={r}
                  onClick={() => { onWide(r); setWideOpen(false); }}
                  className="h-16 text-xl font-bold text-gray-900 bg-white border-2 border-orange-600 rounded-xl hover:bg-orange-600 hover:text-white"
                >
                  {r === 0 ? 'WD' : `WD+${r}`}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-600">
              WD = 1 run, WD+1 = 2 runs, WD+2 = 3 runs, etc.
            </p>
          </DialogContent>
        </Dialog>

        {/* No Ball Dialog */}
        <Dialog open={noBallOpen} onOpenChange={setNoBallOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600">No Ball</DialogTitle>
              <DialogDescription>Choose runs scored off the bat (1 run penalty is automatic)</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 gap-3 py-4">
              {[0, 1, 2, 3, 4, 6].map((r) => (
                <Button
                  key={r}
                  onClick={() => { onNoBall(r); setNoBallOpen(false); }}
                  className="h-16 text-xl font-bold text-white bg-red-600 border-2 border-red-600 rounded-xl hover:bg-red-700 hover:border-red-700"
                >
                  {r === 0 ? 'NB' : `NB+${r}`}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-600">
              NB = 1 run, NB+1 = 2 runs, NB+4 = 5 runs, NB+6 = 7 runs, etc.
            </p>
          </DialogContent>
        </Dialog>

        {/* Wicket Section */}
        <div className="space-y-2">
          <h4 className="px-1 text-xs font-bold tracking-wider text-gray-700 uppercase">Wicket</h4>
          <Button
            className="w-full h-12 text-base font-bold text-white transition-all bg-gray-900 shadow-md rounded-xl hover:shadow-lg hover:bg-gray-800 flex items-center justify-center"
            onClick={() => setWicketOpen(true)}
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            WICKET
          </Button>
          <Dialog open={wicketOpen} onOpenChange={setWicketOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl">Record Wicket</DialogTitle>
                <DialogDescription>Add dismissal details (e.g., bowled, caught, lbw)</DialogDescription>
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
                <Button variant="outline" onClick={() => setWicketOpen(false)} className="text-gray-900 bg-white border-2 border-gray-900 rounded-lg hover:bg-gray-100">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    onWicket(dismissalNote);
                    setDismissalNote("");
                    setWicketOpen(false);
                  }}
                  className="text-white bg-gray-900 border-2 border-gray-900 rounded-lg hover:bg-gray-800"
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
          <h4 className="px-1 text-xs font-bold tracking-wider text-gray-700 uppercase">Commentary Note</h4>
          <Input
            placeholder="Add commentary for this ball..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="h-10 text-sm text-gray-900 border-gray-300 rounded-xl"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onChangeStriker}
            className="font-semibold text-gray-900 bg-white border-2 border-gray-900 h-11 rounded-xl hover:bg-gray-900 hover:text-white"
          >
            Rotate Strike
          </Button>
          <Button
            variant="outline"
            onClick={() => alert("Next over (manual bowler change)")}
            className="font-semibold text-gray-900 bg-white border-2 border-gray-900 h-11 rounded-xl hover:bg-gray-900 hover:text-white"
          >
            End Over
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

//
// --- Core Component ---
//

const CricketLiveScoringUI = ({ initialMatch, matchId }) => {
  const [match, setMatch] = useState(initialMatch || seedMatch);
  const [isSyncing, setIsSyncing] = useState(false);
  const [winner, setWinner] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showTossDialog, setShowTossDialog] = useState(() => {
    const hasToss = initialMatch ? (initialMatch.toss && initialMatch.toss.winner) : (seedMatch.toss && seedMatch.toss.winner);
    return !hasToss;
  });
  const [tossWinner, setTossWinner] = useState("");
  const [tossDecision, setTossDecision] = useState("");
  const current = match.innings[match.currentInningsIndex];

  // Check if toss dialog should be shown when match loads
  useEffect(() => {
    if (initialMatch) {
      const hasToss = initialMatch.toss && initialMatch.toss.winner;
      console.log('[CricketScoringUI] Checking toss on mount:', { hasToss, toss: initialMatch.toss });
      setShowTossDialog(!hasToss);
    }
  }, [initialMatch]);

  //
  // Auto-save to database whenever match state changes (debounced)
  //
  useEffect(() => {
    const syncToDatabase = async () => {
      if (!matchId || isSyncing) return;

      // Don't sync if match is already completed
      const is2ndInnings = match.currentInningsIndex === 1;
      const secondInnings = match.innings[1];
      const isMatchCompleted = is2ndInnings && secondInnings?.complete;

      if (isMatchCompleted) {
        console.log('[CricketScoringUI] Match is completed, skipping auto-sync');
        return;
      }

      try {
        setIsSyncing(true);

        const firstInnings = match.innings[0];
        const secondInnings = match.innings.length > 1 ? match.innings[1] : null;

        const scoreData = {
          teamA: {
            runs: firstInnings.total,
            wickets: firstInnings.wickets
          },
          teamB: {
            runs: secondInnings ? secondInnings.total : 0,
            wickets: secondInnings ? secondInnings.wickets : 0
          },
          overs: formatOvers(current.deliveries),
          status: 'live', // Match is live during scoring
          matchData: {
            innings: match.innings,
            toss: match.toss,
            currentInningsIndex: match.currentInningsIndex
          }
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

    const timeoutId = setTimeout(syncToDatabase, 1000);
    return () => clearTimeout(timeoutId);
  }, [match, matchId, current, isSyncing]);
  // Handle toss and arrange teams accordingly
  const handleTossSubmit = useCallback(() => {
    if (!tossWinner || !tossDecision) {
      alert("Please select toss winner and decision");
      return;
    }

    setMatch((prev) => {
      const copy = { ...prev };

      // Set toss information
      copy.toss = {
        winner: tossWinner,
        elected: tossDecision
      };

      // Determine batting and bowling teams
      let battingTeamName, bowlingTeamName;
      if (tossDecision === "BAT") {
        battingTeamName = tossWinner;
        bowlingTeamName = copy.teams.find(t => t.name !== tossWinner)?.name || '';
      } else {
        bowlingTeamName = tossWinner;
        battingTeamName = copy.teams.find(t => t.name !== tossWinner)?.name || '';
      }

      // Update first innings with correct teams
      copy.innings[0].battingTeam = battingTeamName;
      copy.innings[0].bowlingTeam = bowlingTeamName;

      // Set initial striker, non-striker from batting team
      const battingTeam = copy.teams.find(t => t.name === battingTeamName);
      if (battingTeam && battingTeam.players.length >= 2) {
        copy.innings[0].strikerId = battingTeam.players[0].id;
        copy.innings[0].nonStrikerId = battingTeam.players[1].id;
        copy.innings[0].initialStrikerId = battingTeam.players[0].id;
        copy.innings[0].initialNonStrikerId = battingTeam.players[1].id;
      }

      // Set initial bowler from bowling team
      const bowlingTeam = copy.teams.find(t => t.name === bowlingTeamName);
      if (bowlingTeam && bowlingTeam.players.length >= 1) {
        copy.innings[0].bowlerId = bowlingTeam.players[10]?.id || bowlingTeam.players[0]?.id || '';
      }

      return copy;
    });

    setShowTossDialog(false);
  }, [tossWinner, tossDecision]);

  //
  // Calculate player statistics from all innings
  //
  const calculatePlayerStats = useCallback(() => {
    const playerStatsMap = new Map();

    // Process both innings
    match.innings.forEach((innings) => {
      const battingTeam = match.teams.find(t => t.name === innings.battingTeam);
      const bowlingTeam = match.teams.find(t => t.name === innings.bowlingTeam);

      // Calculate batting stats
      const battingStats = new Map();
      battingTeam.players.forEach((p) => {
        battingStats.set(p.id, { runs: 0, balls: 0 });
      });

      innings.deliveries.forEach((d) => {
        const batter = battingStats.get(d.strikerId);
        if (batter) {
          if (d.type !== "WIDE" && d.type !== "NOBALL") {
            batter.balls += 1;
          }
          batter.runs += d.batsmanRuns;
        }
      });

      // Add batting stats to player map
      battingStats.forEach((stats, playerId) => {
        const player = battingTeam.players.find(p => p.id === playerId);
        if (!player) return;

        if (!playerStatsMap.has(player._id)) {
          playerStatsMap.set(player._id, {
            playerId: player._id,
            teamId: battingTeam._id,
            name: player.name,
            runs: 0,
            wickets: 0
          });
        }
        const playerData = playerStatsMap.get(player._id);
        playerData.runs += stats.runs;
      });

      // Calculate bowling stats
      const bowlingStats = new Map();
      bowlingTeam.players.forEach((p) => {
        bowlingStats.set(p.id, { wickets: 0 });
      });

      innings.deliveries.forEach((d) => {
        const bowler = bowlingStats.get(d.bowlerId);
        if (bowler && d.type === "WICKET") {
          bowler.wickets += 1;
        }
      });

      // Add bowling stats to player map
      bowlingStats.forEach((stats, playerId) => {
        const player = bowlingTeam.players.find(p => p.id === playerId);
        if (!player) return;

        if (!playerStatsMap.has(player._id)) {
          playerStatsMap.set(player._id, {
            playerId: player._id,
            teamId: bowlingTeam._id,
            name: player.name,
            runs: 0,
            wickets: 0
          });
        }
        const playerData = playerStatsMap.get(player._id);
        playerData.wickets += stats.wickets;
      });
    });

    return Array.from(playerStatsMap.values());
  }, [match]);

  //
  // Save completed match to database
  //
  const saveCompletedMatch = useCallback(async (winnerTeam, margin) => {
    try {
      // Build result string
      let resultText = '';
      if (winnerTeam === 'TIE') {
        resultText = 'Match Tied';
      } else {
        resultText = `${winnerTeam} won by ${margin}`;
      }

      // Prepare final score data
      const innings1 = match.innings[0];
      const innings2 = match.innings[1];

      // Calculate legal balls in current over
      const legalBalls = innings2.deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
      const ballsInOver = legalBalls % 6;

      const scoreData = {
        teamA: {
          runs: innings1.battingTeam === match.teams[0].name ? innings1.total : innings2.total,
          wickets: innings1.battingTeam === match.teams[0].name ? innings1.wickets : innings2.wickets
        },
        teamB: {
          runs: innings1.battingTeam === match.teams[1].name ? innings1.total : innings2.total,
          wickets: innings1.battingTeam === match.teams[1].name ? innings1.wickets : innings2.wickets
        },
        overs: `${innings2.oversBowled}.${ballsInOver}`,
        status: 'completed',
        result: resultText,
        matchData: {
          innings: match.innings,
          toss: match.toss
        }
      };

      console.log('[CricketScoring] Saving completed match:', { matchId, scoreData });

      await cricketAPIService.updateMatchScore(matchId, scoreData);

      // Calculate and save player statistics (non-blocking)
      try {
        const playerStats = calculatePlayerStats();
        console.log('[CricketScoring] Saving player statistics:', playerStats);
        await cricketAPIService.updatePlayerStats(matchId, playerStats);
        console.log('[CricketScoring] Player stats saved successfully');
      } catch (statsError) {
        console.error('[CricketScoring] Failed to save player stats (non-critical):', statsError);
        // Continue anyway - player stats update is optional
      }

      console.log('[CricketScoring] Match saved successfully to database');

      // Redirect to cricket management page after 2 seconds
      setTimeout(() => {
        window.location.href = '/admin/cricket';
      }, 2000);
    } catch (error) {
      console.error('[CricketScoring] Failed to save completed match:', error);
      alert(`Match completed but failed to save to database: ${error.message}`);
    }
  }, [match, matchId, calculatePlayerStats]);

  //
  // Helpers to find player entities across teams
  //
  const findPlayer = useCallback((playerId) => {
    return match.teams.flatMap(t => t.players).find(p => p.id === playerId) || null;
  }, [match]);

  const striker = useMemo(() => findPlayer(current.strikerId) || null, [findPlayer, current.strikerId]);
  const nonStriker = useMemo(() => findPlayer(current.nonStrikerId) || null, [findPlayer, current.nonStrikerId]);
  const bowler = useMemo(() => findPlayer(current.bowlerId) || null, [findPlayer, current.bowlerId]);

  const legalBallsThisOver = useMemo(() => {
    const legal = current.deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
    const count = legal % 6;
    return count;
  }, [current.deliveries]);

  // Returns the player list for the current batting team
  const currentBattingPlayers = useMemo(() => {
    const team = match.teams.find(t => t.name === current.battingTeam);
    return team ? team.players : [];
  }, [match.teams, current.battingTeam]);

  // Get available batsmen (those who haven't come to the crease yet)
  const getAvailableBatsmen = useCallback(() => {
    const battedIds = new Set();
    current.deliveries.forEach((d) => {
      battedIds.add(d.strikerId);
    });
    if (current.strikerId) battedIds.add(current.strikerId);
    if (current.nonStrikerId) battedIds.add(current.nonStrikerId);

    return currentBattingPlayers.filter((p) => !battedIds.has(p.id));
  }, [current, currentBattingPlayers]);

  // Recompute striker/non-striker by replaying deliveries from initial striker/nonStriker
  const replayStrikersFromInitial = useCallback((inn) => {
    let s = inn.initialStrikerId || inn.strikerId || '';
    let n = inn.initialNonStrikerId || inn.nonStrikerId || '';
    inn.deliveries.forEach((d, idx) => {
      // For byes, leg byes, and wides - use total runs for strike rotation
      const runsForRotation = (d.type === "BYE" || d.type === "LEGBYE" || d.type === "WIDE")
        ? d.runs
        : d.batsmanRuns;
      ({ strikerId: s, nonStrikerId: n } = swapStrikeIfNeeded(s, n, runsForRotation, d.type));
      ({ strikerId: s, nonStrikerId: n } = endOfOverSwap(s, n, inn.deliveries.slice(0, idx + 1)));
      // if wicket: we assume the striker was dismissed — the code that applies a new batsman
      // will set striker/nonStriker correctly when a batsman is selected.
      if (d.type === "WICKET") {
        // mark striker as out; next batsman logic elsewhere will replace striker when selected
      }
    });
    return { strikerId: s, nonStrikerId: n };
  }, []);

  //
  // Core: handleBall
  //
  const handleBall = useCallback((opts) => {
    // Block scoring if innings complete
    if (current.complete) {
      alert("This innings is complete. Start next innings to continue.");
      return;
    }

    if (!current.strikerId || !current.nonStrikerId || !current.bowlerId) {
      alert("Set striker/non-striker/bowler before scoring.");
      return;
    }

    const now = Date.now();
    const legalBefore = current.deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
    const over = Math.floor(legalBefore / 6);
    const ball = legalBefore % 6;

    // Batsman gets runs only if it's not a bye, leg bye, or wide
    const batsmanRuns = (opts.bye || opts.legbye || opts.type === "WIDE") ? 0 : opts.runs;

    const extraForNoBall = opts.type === "NOBALL" ? 1 : 0;
    const extraForWide = opts.type === "WIDE" ? 1 : 0;

    const del = {
      id: uid(),
      over,
      ball,
      runs: (opts.runs || 0) + extraForNoBall + extraForWide,
      batsmanRuns,
      type: opts.type || "LEGAL",
      notes: opts.notes || "",
      strikerId: current.strikerId,
      nonStrikerId: current.nonStrikerId,
      bowlerId: current.bowlerId || '',
      timestamp: now,
    };

    const nextDeliveries = [...current.deliveries, del];
    const total = nextDeliveries.reduce((acc, d) => acc + d.runs, 0);
    const wickets = nextDeliveries.filter((d) => d.type === "WICKET").length;

    // Determine striker swap due to runs
    // For byes, leg byes, and wides - use total runs for strike rotation
    const runsForStrikeRotation = (del.type === "BYE" || del.type === "LEGBYE" || del.type === "WIDE")
      ? del.runs
      : del.batsmanRuns;

    let { strikerId, nonStrikerId } = swapStrikeIfNeeded(
      current.strikerId,
      current.nonStrikerId,
      runsForStrikeRotation,
      del.type
    );

    // End-of-over swap calculated from deliveries after this ball
    ({ strikerId, nonStrikerId } = endOfOverSwap(strikerId, nonStrikerId, nextDeliveries));

    // Check if innings is complete (either 10 wickets OR overs limit reached)
    const legalAfter = nextDeliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
    const isOversLimitReached = legalAfter >= (current.oversLimit * 6);
    const isAllOut = wickets >= 10;

    // Check if 2nd innings and chasing team has won
    const is2ndInnings = match.currentInningsIndex === 1;
    const chasingTeamWon = is2ndInnings && total >= match.innings[0].total + 1;

    const inningsComplete = isOversLimitReached || isAllOut || chasingTeamWon;

    // Check if over is complete (6 legal balls bowled in current over)
    const isOverComplete = (legalAfter % 6 === 0) && legalAfter > 0 && del.type !== "WIDE" && del.type !== "NOBALL";

    setMatch((prev) => {
      const copy = { ...prev };
      const inn = { ...copy.innings[copy.currentInningsIndex] };
      inn.deliveries = nextDeliveries;
      inn.total = total;
      inn.wickets = wickets;
      inn.strikerId = strikerId;
      inn.nonStrikerId = nonStrikerId;
      inn.oversBowled = Math.floor(legalAfter / 6);

      // Only allow bowler change if over is complete AND innings is not complete
      inn.needBowlerSelection = inningsComplete ? false : isOverComplete;
      inn.needBatsmanSelection = del.type === "WICKET" && !inningsComplete;
      inn.complete = inningsComplete;
      copy.innings[copy.currentInningsIndex] = inn;

      // Determine winner if 2nd innings is complete
      if (is2ndInnings && inningsComplete) {
        if (chasingTeamWon) {
          copy.winner = current.battingTeam;
          copy.winMargin = `${10 - wickets} wickets`;
        } else if (total < match.innings[0].total) {
          copy.winner = current.bowlingTeam;
          copy.winMargin = `${match.innings[0].total - total} runs`;
        } else if (total === match.innings[0].total) {
          copy.winner = "TIE";
          copy.winMargin = "Match Tied";
        }
      }

      return copy;
    });

    // Show celebration and save match if won
    if (is2ndInnings && chasingTeamWon) {
      setWinner(current.battingTeam);
      setShowCelebration(true);
      saveCompletedMatch(current.battingTeam, `${10 - wickets} wickets`);
    } else if (is2ndInnings && inningsComplete && total < match.innings[0].total) {
      setWinner(current.bowlingTeam);
      setShowCelebration(true);
      saveCompletedMatch(current.bowlingTeam, `${match.innings[0].total - total} runs`);
    } else if (is2ndInnings && inningsComplete && total === match.innings[0].total) {
      setWinner("TIE");
      setShowCelebration(true);
      saveCompletedMatch("TIE", "Match Tied");
    }
  }, [current, setMatch, match.currentInningsIndex, match.innings, saveCompletedMatch]);

  //
  // Undo last delivery: reconstruct striker/non-striker from initial state
  //
  const undoLast = useCallback(() => {
    setMatch((prev) => {
      const copy = { ...prev };
      const inn = { ...copy.innings[copy.currentInningsIndex] };
      if (inn.deliveries.length === 0) return prev;
      inn.deliveries = inn.deliveries.slice(0, -1);
      inn.total = inn.deliveries.reduce((a, d) => a + d.runs, 0);
      inn.wickets = inn.deliveries.filter((d) => d.type === "WICKET").length;

      // Recompute striker/non-striker by replay
      const { strikerId, nonStrikerId } = replayStrikersFromInitial(inn);
      inn.strikerId = strikerId;
      inn.nonStrikerId = nonStrikerId;

      const legal = inn.deliveries.filter((d) => d.type !== "WIDE" && d.type !== "NOBALL").length;
      inn.oversBowled = Math.floor(legal / 6);

      // if undo removed the wicket that required batsman selection, clear needBatsmanSelection
      inn.needBatsmanSelection = inn.deliveries.some(d => d.type === "WICKET" && d === inn.deliveries[inn.deliveries.length - 1]) ? true : false;
      inn.needBowlerSelection = false;
      inn.complete = false; // if you undo a ball after innings complete, reopen innings (user can decide)
      copy.innings[copy.currentInningsIndex] = inn;
      return copy;
    });
  }, [replayStrikersFromInitial]);

  //
  // Start 2nd innings (manual; because you chose B)
  //
  const startSecondInnings = useCallback(() => {
    if (match.innings.length > 1) {
      alert("2nd innings already exists!");
      return;
    }

    const firstInnings = match.innings[0];

    if (!firstInnings.complete) {
      // Prevent starting 2nd innings prematurely
      if (!(firstInnings.wickets >= 10 || firstInnings.oversBowled >= firstInnings.oversLimit)) {
        if (!window.confirm("First innings is not complete yet. Do you still want to force start the 2nd innings?")) {
          return;
        }
      }
    }

    const targetScore = firstInnings.total + 1;

    // Find team objects
    const battingTeamObj = match.teams.find(t => t.name === firstInnings.bowlingTeam);
    const bowlingTeamObj = match.teams.find(t => t.name === firstInnings.battingTeam);

    const secondInnings = {
      battingTeam: firstInnings.bowlingTeam,
      bowlingTeam: firstInnings.battingTeam,
      oversLimit: firstInnings.oversLimit,
      deliveries: [],
      wickets: 0,
      total: 0,
      strikerId: battingTeamObj?.players?.[0]?.id || '',
      nonStrikerId: battingTeamObj?.players?.[1]?.id || '',
      initialStrikerId: battingTeamObj?.players?.[0]?.id || '',
      initialNonStrikerId: battingTeamObj?.players?.[1]?.id || '',
      bowlerId: bowlingTeamObj?.players?.[bowlingTeamObj.players.length - 1]?.id || '',
      oversBowled: 0,
      target: targetScore,
      needBowlerSelection: false,
      needBatsmanSelection: false,
      complete: false,
    };

    setMatch((prev) => ({
      ...prev,
      innings: [...prev.innings, secondInnings],
      currentInningsIndex: 1,
      status: "2nd Innings"
    }));
  }, [match]);

  const switchInnings = useCallback((index) => {
    if (index < 0 || index >= match.innings.length) return;
    setMatch((prev) => ({ ...prev, currentInningsIndex: index }));
  }, [match.innings.length]);

  const currentRR = calcRR(current.total, current.deliveries);
  const oversFmt = formatOvers(current.deliveries);

  // select new batsman after wicket
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

  // Render
  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-white">
      <header className="sticky top-0 z-20 border-b border-gray-300 backdrop-blur bg-white/90">
        <div className="flex items-center justify-between max-w-full gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="grid font-bold text-white bg-gray-900 size-9 rounded-2xl place-items-center">S</div>
            <div>
              <div className="text-lg font-semibold leading-tight text-gray-900">Spoural — Live Scoring</div>
              <div className="text-xs text-gray-600">
                Cricket • {matchId ? 'Connected to Database' : 'Demo Mode'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 text-sm font-semibold text-gray-900 bg-white border-2 border-gray-900 rounded-lg">
              {match.innings.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => switchInnings(idx)}
                  className={`px-3 py-1 rounded transition-all ${match.currentInningsIndex === idx ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 hover:bg-gray-200'}`}
                >
                  {idx === 0 ? '1st' : '2nd'} Innings
                </button>
              ))}
            </div>

            <Badge className="px-3 py-1 text-white bg-gray-900 rounded-xl hover:bg-gray-800">
              <Radio className="mr-1 h-3.5 w-3.5" />
              LIVE
            </Badge>
            {isSyncing && (
              <Badge variant="outline" className="px-3 py-1 text-gray-900 bg-white border-2 border-gray-900 rounded-xl">
                <div className="w-2 h-2 mr-2 bg-gray-900 rounded-full animate-pulse"></div>
                Syncing...
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={undoLast} className="text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Undo
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-full px-6 py-6">
        <div className="space-y-6">
          <Card className="border-gray-300 shadow-sm rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-gray-900">{match.title}</CardTitle>
              <div className="text-sm text-gray-600">
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
                  overs={`${Math.floor(match.innings[0].deliveries.filter(d => d.type !== "WIDE" && d.type !== "NOBALL").length / 6)}.${match.innings[0].deliveries.filter(d => d.type !== "WIDE" && d.type !== "NOBALL").length % 6}/${match.innings[0].oversLimit}`}
                />
                <div className="hidden text-center text-gray-500 md:block">vs</div>
                <TeamStrip
                  name={match.teams[1].name}
                  right
                  score={match.innings.length > 1 ? match.innings[1].total : 0}
                  wickets={match.innings.length > 1 ? match.innings[1].wickets : 0}
                  overs={match.innings.length > 1 ?
                    `${Math.floor(match.innings[1].deliveries.filter(d => d.type !== "WIDE" && d.type !== "NOBALL").length / 6)}.${match.innings[1].deliveries.filter(d => d.type !== "WIDE" && d.type !== "NOBALL").length % 6}/${match.innings[1].oversLimit}`
                    : `0.0/${match.innings[0].oversLimit}`}
                  muted={match.innings.length === 1}
                />
              </div>

              {/* Target display if 2nd innings */}
              {match.innings.length > 1 && match.currentInningsIndex === 1 && (
                <div className="mt-2 text-sm font-semibold text-center text-gray-900">
                  Target: {match.innings[1].target} | Need {Math.max(0, match.innings[1].target - match.innings[1].total)} runs from {(match.innings[0].oversLimit * 6) - match.innings[1].deliveries.filter(d => d.type !== "WIDE" && d.type !== "NOBALL").length} balls
                </div>
              )}

              {/* Show 1st Innings Complete Summary and a Start 2nd Innings button (manual) */}
              {match.innings.length === 1 && match.innings[0].complete && (
                <div className="p-3 mt-3 border-2 border-gray-300 rounded-lg bg-gray-50">
                  <div className="text-xs font-semibold text-gray-600 uppercase">1st Innings Complete</div>
                  <div className="mt-1 text-sm font-bold text-gray-900">
                    {match.teams[0].name}: {match.innings[0].total}/{match.innings[0].wickets}
                    <span className="ml-2 text-gray-600">
                      ({Math.floor(match.innings[0].deliveries.filter(d => d.type !== "WIDE" && d.type !== "NOBALL").length / 6)}.{match.innings[0].deliveries.filter(d => d.type !== "WIDE" && d.type !== "NOBALL").length % 6} overs)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Button onClick={startSecondInnings} className="w-full text-white bg-gray-900 border-2 border-gray-900 hover:bg-white hover:text-gray-900">
                      Start 2nd Innings
                    </Button>
                    <Button onClick={() => alert("View detailed scorecard coming soon")} variant="outline" className="w-full text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white">
                      View Scorecard
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-3 text-sm text-gray-700">
                Toss: {match.toss?.winner} elected to {match.toss?.elected === "BAT" ? "bat" : "bowl"}.
              </div>
            </CardContent>
          </Card>

          <div className="grid items-start gap-6 xl:grid-cols-4 lg:grid-cols-3">
            <div className="space-y-6 xl:col-span-3 lg:col-span-2">
              <ScoreStrip total={current.total} wickets={current.wickets} overs={oversFmt} rr={currentRR} />
              <OverProgress deliveries={current.deliveries} />

              <Card className="border-gray-300 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">Batting — {current.battingTeam}</CardTitle>
                </CardHeader>
                <CardContent>
                  <BattingTable
                    deliveries={current.deliveries}
                    players={currentBattingPlayers}
                    strikerId={current.strikerId}
                    nonStrikerId={current.nonStrikerId}
                  />
                </CardContent>
              </Card>

              <Card className="border-gray-300 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">Bowling — {current.bowlingTeam}</CardTitle>
                </CardHeader>
                <CardContent>
                  <BowlingTable
                    deliveries={current.deliveries}
                    players={(match.teams.find(t => t.name === current.bowlingTeam) || { players: [] }).players}
                    currentBowlerId={current.bowlerId}
                  />
                </CardContent>
              </Card>

              <Tabs defaultValue="commentary" className="rounded-2xl">
                <TabsList className="grid w-full grid-cols-3 bg-white">
                  <TabsTrigger value="commentary" className="text-white data-[state=active]:bg-gray-900 data-[state=active]:text-white">Commentary</TabsTrigger>
                  <TabsTrigger value="lineups" className="text-white data-[state=active]:bg-gray-900 data-[state=active]:text-white">Line-ups</TabsTrigger>
                  <TabsTrigger value="info" className="text-white data-[state=active]:bg-gray-900 data-[state=active]:text-white">Info</TabsTrigger>
                </TabsList>
                <TabsContent value="commentary">
                  <Card className="border-gray-300 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Ball-by-ball</CardTitle>
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
                  <Card className="border-gray-300 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Playing XIs</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                      <LineupCard title={match.teams[0].name} players={match.teams[0].players} />
                      <LineupCard title={match.teams[1].name} players={match.teams[1].players} />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="info">
                  <Card className="border-gray-300 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="text-gray-900">Match Info</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm text-gray-700">
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
                bowlingOptions={(match.teams.find(t => t.name === current.bowlingTeam) || { players: [] }).players}
                needBowlerSelection={current.needBowlerSelection || false}
                needBatsmanSelection={current.needBatsmanSelection || false}
                onSelectNewBatsman={handleSelectNewBatsman}
                batsmanOptions={getAvailableBatsmen()}
              />

              <Card className="border-gray-300 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-gray-900">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => alert("Saved locally (demo)")} className="text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white">
                    Save Snapshot
                  </Button>
                  <Button variant="outline" onClick={() => alert("Synced (mock)")} className="text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white">
                    Sync
                  </Button>
                  <Button variant="outline" onClick={() => alert("Export JSON coming soon")} className="text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white">
                    Export JSON
                  </Button>
                  <Button variant="outline" onClick={() => alert("Import JSON coming soon")} className="text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-900 hover:text-white">
                    Import JSON
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 text-xs text-center text-gray-600 border-t border-gray-300">
        © {new Date().getFullYear()} Spoural • {matchId ? 'Live scoring with database sync' : 'Demo mode'}
      </footer>

      {/* Toss Dialog */}
      <Dialog open={showTossDialog} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-900">
              🪙 Toss
            </DialogTitle>
            <DialogDescription className="text-center">
              Select which team won the toss and their decision
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {/* Toss Winner Selection */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-black-900">Which team won the toss?</label>
              <div className="grid grid-cols-2 gap-3">
                {match.teams.map((team) => (
                  <Button
                    key={team.name}
                    onClick={() => setTossWinner(team.name)}
                    style={{
                      color: tossWinner === team.name ? 'white' : 'black'
                    }}
                    className={`h-16 text-base font-semibold transition-all ${tossWinner === team.name
                        ? 'bg-gray-900 border-2 border-gray-900'
                        : 'bg-white border-2 border-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    {team.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Toss Decision Selection */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-900">What did they choose?</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => setTossDecision("BAT")}
                  style={{
                    color: tossDecision === "BAT" ? 'white' : 'black'
                  }}
                  className={`h-16 text-base font-semibold transition-all ${tossDecision === "BAT"
                      ? 'bg-gray-900 border-2 border-gray-900'
                      : 'bg-white border-2 border-gray-900 hover:bg-gray-100'
                    }`}
                >
                  Bat First
                </Button>
                <Button
                  onClick={() => setTossDecision("BOWL")}
                  style={{
                    color: tossDecision === "BOWL" ? 'white' : 'black'
                  }}
                  className={`h-16 text-base font-semibold transition-all ${tossDecision === "BOWL"
                      ? 'bg-gray-900 border-2 border-gray-900'
                      : 'bg-white border-2 border-gray-900 hover:bg-gray-100'
                    }`}
                >
                  Bowl First
                </Button>
              </div>
            </div>

            {/* Summary */}
            {tossWinner && tossDecision && (
              <div className="p-4 border-2 border-gray-900 rounded-lg bg-gray-50">
                <div className="text-sm font-semibold text-gray-600 uppercase">Summary</div>
                <div className="mt-2 text-base font-bold text-gray-900">
                  {tossWinner} won the toss and elected to {tossDecision === "BAT" ? "bat" : "bowl"} first
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleTossSubmit}
              disabled={!tossWinner || !tossDecision}
              className="w-full text-white bg-gray-900 border-2 border-gray-900 hover:bg-white hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Match Winner Celebration Dialog */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center text-gray-900">
              🎉 {winner === "TIE" ? "Match Tied!" : `${winner} Wins!`} 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center">
            {winner !== "TIE" && (
              <>
                <div className="mb-4 text-6xl animate-bounce">🏆</div>
                <div className="text-2xl font-bold text-gray-900">{winner}</div>
                <div className="mt-2 text-lg text-gray-600">
                  Won by {match.winMargin || ""}
                </div>
              </>
            )}
            {winner === "TIE" && (
              <>
                <div className="mb-4 text-6xl">🤝</div>
                <div className="text-xl font-semibold text-gray-700">
                  What an amazing match! Both teams scored the same runs.
                </div>
              </>
            )}
            <div className="p-4 mt-6 border-2 border-gray-900 rounded-lg bg-gray-50">
              <div className="text-sm font-semibold text-gray-600 uppercase">Match Summary</div>
              <div className="mt-2 text-base text-gray-900">
                <div>{match.teams[0].name}: {match.innings[0].total}/{match.innings[0].wickets}</div>
                {match.innings.length > 1 && (
                  <div>{match.teams[1].name}: {match.innings[1].total}/{match.innings[1].wickets}</div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowCelebration(false)}
              className="w-full text-white bg-gray-900 border-2 border-gray-900 hover:bg-white hover:text-gray-900"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CricketLiveScoringUI;
