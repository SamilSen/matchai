let data = [];
let ready = false;

fetch("https://raw.githubusercontent.com/SamilSen/matchai/main/predictions.csv")
.then(r => r.text())
.then(t => {
  const rows = t.trim().split("\n").slice(1);

  data = rows.map(r => {
    const c = r.split(",");
    return {
      team1: c[0],
      team2: c[1],
      code1: c[2],
      code2: c[3],
      home: +c[4],
      draw: +c[5],
      away: +c[6]
    };
  });

  ready = true;
  document.getElementById("status").innerHTML = "✅ Ready";
});

function bar(label, value, color) {
  return `
    <div style="margin:12px 0; font-size:20px;">
      <div style="display:flex; justify-content:space-between;">
        <b>${label}</b><b>${value}%</b>
      </div>
      <div style="background:#eee; height:18px; border-radius:12px;">
        <div style="width:${value}%; height:18px; background:${color}; border-radius:12px;"></div>
      </div>
    </div>
  `;
}

function predict() {
  if (!ready) return alert("Loading...");

  const t1 = document.getElementById("team1").value.toLowerCase().trim();
  const t2 = document.getElementById("team2").value.toLowerCase().trim();

  const m = data.find(x =>
    x.team1.toLowerCase() === t1 && x.team2.toLowerCase() === t2
  );

  if (!m) {
    document.getElementById("result").innerHTML = "❌ Not found";
    return;
  }

  let pred =
    (m.home > m.away && m.home > m.draw) ? m.team1 + " Win" :
    (m.away > m.home && m.away > m.draw) ? m.team2 + " Win" :
    "Draw";

  document.getElementById("result").innerHTML = `
    <div style="margin-top:30px; padding:35px; border:1px solid #ddd; display:inline-block; min-width:550px; border-radius:18px; font-size:28px;">

      <div style="display:flex; justify-content:center; gap:25px;">
        <img src="https://flagcdn.com/w96/${m.code1.toLowerCase()}.png">
        <b>${m.team1}</b>
        <span>VS</span>
        <b>${m.team2}</b>
        <img src="https://flagcdn.com/w96/${m.code2.toLowerCase()}.png">
      </div>

      <h3>🔮 ${pred}</h3>

      ${bar("1", m.home, "green")}
      ${bar("X", m.draw, "orange")}
      ${bar("2", m.away, "red")}

    </div>
  `;
}
