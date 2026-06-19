import { useState, useEffect } from "react";
import { DIRECTORS_DATA } from "../../data";
import { RoutePath, Director } from "../../types";
import { getBoardMembers, getDirectorPortrait } from "../../utils/storage";
import { User, ShieldAlert, Award, Anchor, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import BoardProfileCard from "../BoardProfileCard";

interface BoardProps {
  navigate: (path: RoutePath) => void;
}

export default function Board({ navigate }: BoardProps) {
  const [boardList, setBoardList] = useState<Director[]>([]);

  useEffect(() => {
    setBoardList(getBoardMembers());
  }, []);

  // Extract specific leaders with safe fallback to static template data
  const level1Arr = boardList.filter((d) => d.level === 1).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const level2Arr = boardList.filter((d) => d.level === 2).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const level3Arr = boardList.filter((d) => d.level === 3).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const level4Arr = boardList.filter((d) => d.level === 4).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

  const president = level1Arr[0] || boardList.find((d) => d.id === "humayun-kabir-robel") || DIRECTORS_DATA[0];
  const vicePresident = level2Arr[0] || boardList.find((d) => d.id === "farhan-bin-rafiq") || DIRECTORS_DATA[1];
  const secretariatDirectors = level3Arr.length > 0 ? level3Arr : boardList.filter((d) => d.id === "syfuddin-khaled" || d.id === "arifur-rahman");
  const rawFounding = level4Arr.length > 0 ? level4Arr : boardList.filter((d) => d.level === 4 || (d.id !== "humayun-kabir-robel" && d.id !== "farhan-bin-rafiq" && d.id !== "syfuddin-khaled" && d.id !== "arifur-rahman"));
  const foundingDirectors = [...rawFounding].sort((a, b) => a.name.localeCompare(b.name));

  const getPortrait = (dir: Director) => {
    return getDirectorPortrait(dir);
  };

  return (
    <div className="bg-bg-primary min-h-screen">
      {/* Page Header */}
      <section className="relative h-72 bg-navy flex items-center justify-center overflow-hidden border-b border-navy-light">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center">
          <div className="absolute inset-0 bg-navy/85 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-3">
          <p className="font-sans text-[10px] tracking-[0.2em] text-gold uppercase font-semibold">
            Cox's Bazar Boat Club Ltd.
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-extralight text-white tracking-tight font-light">
            Board of <span className="font-serif italic text-gold">Governors & Directors</span>
          </h1>
          <div className="font-sans text-[11px] text-slate-400 flex items-center justify-center space-x-2">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gold">Board of Directors</span>
          </div>
        </div>
      </section>

      {/* Intro section */}
      <section className="py-16 bg-white border-b border-slate-100 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-sans text-[9px] uppercase tracking-widest text-[#c9a84c] font-semibold">
            The Council Ledger
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-light text-text-dark tracking-tight">
            Distinguished Founders & Executive Trustees
          </h2>
          <p className="font-sans text-xs sm:text-[13px] text-text-body leading-relaxed font-light">
            In compliance with our corporate guarantee model under The Companies Act, 1994, CBBCL operations 
            are steered by an elite 15-member Board of Directors. Together, they hold fiduciary responsibility for 
            asset management, financial stability, and maintaining our world-class standards of coastal hospitality.
          </p>
        </div>
      </section>

      {/* Board Org Hierarchy Grid */}
      <section className="py-24 px-6 max-w-6xl mx-auto space-y-20">
        
        {/* ROW 1: FOUNDING PRESIDENT (CENTER) */}
        <div className="space-y-6 text-center">
          <span className="font-sans text-[10px] text-gold uppercase tracking-[0.25em] font-bold block">
            Row I: High Presidency
          </span>
          
          <div className="flex justify-center">
            {president && <BoardProfileCard director={president} navigate={navigate} variant="president" />}
          </div>
        </div>

        {/* ROW 2: FOUNDING VICE PRESIDENT (CENTER) */}
        <div className="space-y-6 text-center">
          <span className="font-sans text-[10px] text-[#1a2744] uppercase tracking-[0.2em] font-bold block">
            Row II: Vice Presidency
          </span>

          <div className="flex justify-center gap-6 flex-wrap">
            {level2Arr.map((vp) => (
              <BoardProfileCard key={vp.id} director={vp} navigate={navigate} variant="main" />
            ))}
          </div>
        </div>

        {/* ROW 3: TWO CARDS (Syfuddin Khaled Administration + Arifur Rahman Finance) */}
        <div className="space-y-6">
          <h5 className="font-sans text-[10px] text-[#1a2744] uppercase tracking-[0.2em] font-bold text-center block">
            Row III: Core Secretariat Directors
          </h5>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-3xl mx-auto w-full">
            {secretariatDirectors.map((dir) => (
              <BoardProfileCard key={dir.id} director={dir} navigate={navigate} variant="main" />
            ))}
          </div>
        </div>

        {/* ROW 4: 11 FOUNDING DIRECTORS */}
        <div className="space-y-8">
          <h5 className="font-sans text-[10px] text-[#1a2744] uppercase tracking-[0.2em] font-bold text-center block">
            Row IV: Founding Directors Council
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto justify-items-center">
            {foundingDirectors.map((dir) => (
              <BoardProfileCard key={dir.id} director={dir} navigate={navigate} variant="compact" />
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}
