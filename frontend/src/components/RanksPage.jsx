// RankingPage.jsx
import React from "react";
import "./ranksPage.css";


export default function RanksPage() {
const data = [
{ name: "Alice", score: 95 },
{ name: "Bob", score: 88 },
{ name: "Charlie", score: 76 },
];


return (
<div className="ranking-container">
<div className="ranking-card">
<h2 className="ranking-title">Leaderboard</h2>
<ul className="ranking-list">
{data.map((item, index) => (
<li key={index} className="ranking-item">
<span className="ranking-name">{item.name}</span>
<span className="ranking-score">{item.score}</span>
</li>
))}
</ul>
</div>
</div>
);
}
