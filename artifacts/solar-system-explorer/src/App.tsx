import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useLocation, Route, Switch, Router as WouterRouter } from 'wouter';
import { Activity, BookOpen, CircleHelp, Gauge, Info, Minus, Move, Pause, Play, Plus, RotateCcw, Sparkles, Sun, Telescope, Zap } from 'lucide-react';
import NotFound from '@/pages/not-found';

type Planet = {
  id: string; name: string; latin: string; color: string; glow: string; gradient: string;
  orbit: number; radius: number; speed: number; angle: number; mass: string; diameter: string;
  composition: string; distanceSun: string; distanceEarth: string; orbitalPeriod: string;
  rotationPeriod: string; temperature: string; description: string;
};

const planets: Planet[] = [
  { id: 'mercury', name: 'Меркурий', latin: 'Mercurius', color: '#b7a999', glow: 'rgba(190,170,150,.3)', gradient: 'linear-gradient(135deg,#ded2c4,#6c625e)', orbit: 57, radius: 5, speed: 4.14, angle: 2.2, mass: '3,301 × 10²³ кг', diameter: '4 879 км', composition: 'Каменный, железное ядро', distanceSun: '57,9 млн км', distanceEarth: '91,7–208,3 млн км', orbitalPeriod: '87,97 суток', rotationPeriod: '58,6 суток', temperature: '−173…+427 °C', description: 'Самая маленькая планета системы и ближайший к Солнцу мир. Здесь один солнечный день длится дольше года.' },
  { id: 'venus', name: 'Венера', latin: 'Venus', color: '#e9b86d', glow: 'rgba(236,178,92,.38)', gradient: 'linear-gradient(135deg,#ffe0a0,#b86f43)', orbit: 82, radius: 8, speed: 1.62, angle: 4.8, mass: '4,867 × 10²⁴ кг', diameter: '12 104 км', composition: 'Каменная, силикатная мантия', distanceSun: '108,2 млн км', distanceEarth: '38,2–261 млн км', orbitalPeriod: '224,7 суток', rotationPeriod: '−243 суток', temperature: '+464 °C', description: 'Самая горячая планета — плотная атмосфера удерживает тепло мощным парниковым эффектом.' },
  { id: 'earth', name: 'Земля', latin: 'Terra', color: '#66c9c2', glow: 'rgba(77,211,208,.44)', gradient: 'linear-gradient(135deg,#94e1da 5%,#3476bd 50%,#15325e)', orbit: 112, radius: 9, speed: 1, angle: 1.1, mass: '5,972 × 10²⁴ кг', diameter: '12 742 км', composition: 'Каменная, 71% поверхности — вода', distanceSun: '149,6 млн км', distanceEarth: '—', orbitalPeriod: '365,25 суток', rotationPeriod: '23 ч 56 мин', temperature: '−89…+58 °C', description: 'Наш дом — единственный известный мир с устойчивыми океанами жидкой воды и жизнью.' },
  { id: 'mars', name: 'Марс', latin: 'Mars', color: '#d87555', glow: 'rgba(224,108,74,.38)', gradient: 'linear-gradient(135deg,#ecaa77,#883d35)', orbit: 143, radius: 7, speed: .53, angle: 5.4, mass: '6,417 × 10²³ кг', diameter: '6 779 км', composition: 'Каменный, железо и базальт', distanceSun: '227,9 млн км', distanceEarth: '54,6–401 млн км', orbitalPeriod: '687 суток', rotationPeriod: '24 ч 37 мин', temperature: '−125…+20 °C', description: 'Красная планета с полярными шапками, глубокими каньонами и следами древних водных потоков.' },
  { id: 'jupiter', name: 'Юпитер', latin: 'Jupiter', color: '#e3b985', glow: 'rgba(224,173,111,.34)', gradient: 'linear-gradient(175deg,#f6d6a6 5%,#b87d58 37%,#ead0a9 43%,#8f5842 64%,#d4a277)', orbit: 187, radius: 17, speed: .084, angle: 2.7, mass: '1,898 × 10²⁷ кг', diameter: '139 820 км', composition: 'Водород и гелий', distanceSun: '778,5 млн км', distanceEarth: '588–968 млн км', orbitalPeriod: '11,86 лет', rotationPeriod: '9 ч 56 мин', temperature: '−110 °C', description: 'Газовый гигант и самый массивный объект системы после Солнца. Большое красное пятно — шторм размером с Землю.' },
  { id: 'saturn', name: 'Сатурн', latin: 'Saturnus', color: '#e4c98f', glow: 'rgba(223,193,116,.36)', gradient: 'linear-gradient(160deg,#f4dfaa,#b78e5c 55%,#725542)', orbit: 230, radius: 15, speed: .034, angle: 4.4, mass: '5,683 × 10²⁶ кг', diameter: '116 460 км', composition: 'Водород и гелий, ледяные кольца', distanceSun: '1,43 млрд км', distanceEarth: '1,2–1,65 млрд км', orbitalPeriod: '29,45 лет', rotationPeriod: '10 ч 42 мин', temperature: '−140 °C', description: 'Украшен системой ярких колец из льда и камня. Его плотность настолько мала, что он плавал бы в воде.' },
  { id: 'uranus', name: 'Уран', latin: 'Uranus', color: '#84d6d7', glow: 'rgba(111,215,217,.32)', gradient: 'linear-gradient(135deg,#c4f6ee,#4ca6b2)', orbit: 270, radius: 11, speed: .012, angle: 1.7, mass: '8,681 × 10²⁵ кг', diameter: '50 724 км', composition: 'Лёд, вода, аммиак и метан', distanceSun: '2,87 млрд км', distanceEarth: '2,6–3,2 млрд км', orbitalPeriod: '84 года', rotationPeriod: '17 ч 14 мин', temperature: '−195 °C', description: 'Ледяной гигант, вращающийся почти на боку. Метан в атмосфере окрашивает его в холодный бирюзовый цвет.' },
  { id: 'neptune', name: 'Нептун', latin: 'Neptunus', color: '#718ce3', glow: 'rgba(100,130,227,.38)', gradient: 'linear-gradient(135deg,#8db8f3,#2f458f)', orbit: 307, radius: 11, speed: .006, angle: 4.9, mass: '1,024 × 10²⁶ кг', diameter: '49 244 км', composition: 'Лёд, вода и метан', distanceSun: '4,50 млрд км', distanceEarth: '4,3–4,7 млрд км', orbitalPeriod: '164,8 лет', rotationPeriod: '16 ч 6 мин', temperature: '−200 °C', description: 'Самый далёкий гигант системы. На Нептуне дуют самые быстрые ветры — до 2 100 км/ч.' },
];

const sun: Planet = { id: 'sun', name: 'Солнце', latin: 'Sol', color: '#ffca70', glow: 'rgba(255,195,92,.6)', gradient: 'linear-gradient(135deg,#fff1bc,#e8953e)', orbit: 0, radius: 27, speed: 0, angle: 0, mass: '1,989 × 10³⁰ кг', diameter: '1 392 700 км', composition: 'Плазма: водород и гелий', distanceSun: '—', distanceEarth: '149,6 млн км', orbitalPeriod: '≈ 225 млн лет вокруг центра Галактики', rotationPeriod: '25–35 суток', temperature: '≈ 5 500 °C на поверхности', description: 'Звезда в центре нашей системы. Её гравитация удерживает планеты на орбитах, а свет достигает Земли за 8 минут 20 секунд.' };
const bodies = [sun, ...planets];

function formatDay(day: number) {
  const years = Math.floor(day / 365.25);
  const days = Math.floor(day % 365.25);
  return years ? `${years} г ${String(days).padStart(3, '0')} д` : `${days} дней`;
}

function PlanetVisual({ planet, selected, onSelect, x, y, center }: { planet: Planet; selected: boolean; onSelect: () => void; x: number; y: number; center: { x: number; y: number } }) {
  const r = planet.radius;
  return (
    <g className={`planet-hit ${selected ? 'selected' : ''}`} tabIndex={0} role="button" aria-label={`Выбрать ${planet.name}`} onClick={onSelect} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}>
      <circle className="planet-halo" cx={x} cy={y} r={r + 8} />
      <ellipse className="planet-shadow" cx={x + r * .45} cy={y + r * .55} rx={r * .88} ry={r * .4} fill={planet.glow} />
      {planet.id === 'saturn' && <ellipse cx={x} cy={y} rx={r * 1.9} ry={r * .65} fill="none" stroke="#c9aa78" strokeWidth="3" opacity=".66" transform={`rotate(-12 ${x} ${y})`} />}
      {planet.id === 'saturn' && <ellipse cx={x} cy={y} rx={r * 1.45} ry={r * .42} fill="none" stroke="#f4dba8" strokeWidth="1" opacity=".55" transform={`rotate(-12 ${x} ${y})`} />}
      <circle cx={x} cy={y} r={r} fill={planet.gradient} stroke={planet.color} strokeWidth="1.1" />
      {planet.id === 'jupiter' && <path d={`M${x-r} ${y-2} Q${x} ${y-5} ${x+r} ${y-1} M${x-r*.8} ${y+4} Q${x} ${y+7} ${x+r*.8} ${y+3}`} fill="none" stroke="#8e5b49" opacity=".7" strokeWidth="1.5" />}
      {planet.id === 'earth' && <path d={`M${x-4} ${y-4}q3-5 6-1l-1 4 3 2-5 4-3-3z`} fill="#6ca87d" opacity=".9" />}
      <text className="planet-label" x={x} y={y + r + 16} textAnchor="middle">{planet.name}</text>
      <circle cx={center.x} cy={center.y} r="1.8" fill={planet.color} opacity=".6" />
    </g>
  );
}

function OrbitScene({ selectedId, setSelectedId, zoom, pan, setPan, playing, speed, onZoom }: { selectedId: string; setSelectedId: (id: string) => void; zoom: number; pan: { x: number; y: number }; setPan: (p: { x: number; y: number }) => void; playing: boolean; speed: number; onZoom: (amount: number) => void }) {
  const dragStart = useRef<{ x: number; y: number; pan: { x: number; y: number } } | null>(null);
  const [clock, setClock] = useState(() => Date.now());
  const center = { x: 330, y: 235 };
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const animate = () => { setClock(Date.now()); frame = window.requestAnimationFrame(animate); };
    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [playing]);
  const rendered = useMemo(() => planets.map((planet) => {
    const angle = planet.angle + (playing ? (clock / 100000) * planet.speed * speed : 0);
    return { planet, x: center.x + Math.cos(angle) * planet.orbit, y: center.y + Math.sin(angle) * planet.orbit * .67 };
  }), [clock, playing, speed]);
  return (
    <div className="orbit-stage" onWheel={(e) => { e.preventDefault(); onZoom(e.deltaY < 0 ? .08 : -.08); }} onPointerDown={(e) => { dragStart.current = { x: e.clientX, y: e.clientY, pan }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }} onPointerMove={(e) => { if (dragStart.current) setPan({ x: dragStart.current.pan.x + e.clientX - dragStart.current.x, y: dragStart.current.pan.y + e.clientY - dragStart.current.y }); }} onPointerUp={() => { dragStart.current = null; }} onPointerLeave={() => { dragStart.current = null; }}>
      <div className="camera-readout"><Move size={12} /> ПЕРЕТАЩИТЕ ДЛЯ НАВИГАЦИИ</div>
      <svg className="orbit-svg" viewBox="0 0 660 470" aria-label="Интерактивная карта орбит планет" role="img">
        <defs>
          <filter id="sun-glow"><feGaussianBlur stdDeviation="6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <g transform={`translate(${pan.x} ${pan.y}) translate(${center.x} ${center.y}) scale(${zoom}) translate(${-center.x} ${-center.y})`}>
          {Array.from({ length: 42 }).map((_, i) => <circle key={i} className={`star ${i % 5 === 0 ? 'warm' : ''}`} cx={(i * 113) % 650 + 5} cy={(i * 71) % 455 + 5} r={i % 7 === 0 ? 1.3 : .7} opacity={.3 + (i % 4) * .15} />)}
          {planets.map((planet, i) => <ellipse key={planet.id} className={`orbit-guide ${i < 2 ? 'inner' : ''}`} cx={center.x} cy={center.y} rx={planet.orbit} ry={planet.orbit * .67} />)}
          <circle className="sun-ring" cx={center.x} cy={center.y} r="36" />
          <g className={`planet-hit ${selectedId === 'sun' ? 'selected' : ''}`} role="button" tabIndex={0} aria-label="Выбрать Солнце" onClick={() => setSelectedId('sun')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedId('sun'); }}>
            <circle className="planet-halo" cx={center.x} cy={center.y} r="39" />
            <circle className="sun-core" cx={center.x} cy={center.y} r={sun.radius} />
            <circle cx={center.x - 8} cy={center.y - 9} r="5" fill="#ffe3a1" opacity=".7" />
            <text className="planet-label" x={center.x} y={center.y + 49} textAnchor="middle">СОЛНЦЕ</text>
          </g>
          {rendered.map(({ planet, x, y }) => <PlanetVisual key={planet.id} planet={planet} selected={selectedId === planet.id} onSelect={() => setSelectedId(planet.id)} x={x} y={y} center={center} />)}
        </g>
      </svg>
      <div className="stage-tip">Положение планет показано условно · расстояния не в масштабе</div>
      <div className="zoom-controls" aria-label="Управление масштабом">
        <button type="button" data-testid="button-zoom-out" aria-label="Уменьшить масштаб" onClick={() => onZoom(-.08)}><Minus size={14} /></button>
        <span className="zoom-level">{Math.round(zoom * 100)}%</span>
        <button type="button" data-testid="button-zoom-in" aria-label="Увеличить масштаб" onClick={() => onZoom(.08)}><Plus size={14} /></button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return <button className={`nav-item ${active ? 'active' : ''}`} data-testid={`button-nav-${label}`} aria-current={active ? 'page' : undefined} onClick={onClick}>{icon}<span>{label}</span></button>;
}

function Home() {
  const [selectedId, setSelectedId] = useState('earth');
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [day, setDay] = useState(12847);
  const [activeNav, setActiveNav] = useState('Обзор');
  const [showGuide, setShowGuide] = useState(false);
  const selected = bodies.find((body) => body.id === selectedId) ?? planets[2];
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setDay((value) => value + speed), 1000);
    return () => window.clearInterval(timer);
  }, [playing, speed]);
  const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }); setSelectedId('earth'); };
  const setZoomClamped = (next: number) => setZoom(Math.max(.72, Math.min(1.45, next)));
  const navigateLocally = (label: string) => {
    setActiveNav(label);
    if (label === 'Обзор') window.scrollTo({ top: 0, behavior: 'smooth' });
    if (label === 'Объекты') document.querySelector('.navigator-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (label === 'Миссии') { setSelectedId('sun'); document.querySelector('.detail-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  };
  return (
    <div className="observatory-app">
      <div className="app-shell">
        <aside className="sidebar">
          <div>
            <div className="brand" aria-label="Орбита — интерактивная солнечная система">
              <div className="brand-mark" aria-hidden="true" /><div className="brand-name"><strong>ОРБИТА</strong><span>живой атлас</span></div>
            </div>
            <div className="nav-label">Навигация</div>
            <nav className="side-nav" aria-label="Основная навигация">
              <NavItem icon={<Telescope size={16} />} label="Обзор" active={activeNav === 'Обзор'} onClick={() => navigateLocally('Обзор')} />
              <NavItem icon={<BookOpen size={16} />} label="Объекты" active={activeNav === 'Объекты'} onClick={() => navigateLocally('Объекты')} />
              <NavItem icon={<Activity size={16} />} label="Миссии" active={activeNav === 'Миссии'} onClick={() => navigateLocally('Миссии')} />
            </nav>
          </div>
          <div className="sidebar-foot">
            <div>Тихое место для<br />больших вопросов.</div>
            <div className="mono">ОБСЕРВАТОРИЯ / 01<br />ДАННЫЕ: NASA · ESA</div>
          </div>
        </aside>
        <main className="main-content">
          <header className="topbar">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" /> Система в реальном времени</div>
              <h1 className="page-title">Солнечная система</h1>
              <p className="page-subtitle">Исследуйте соседей по космическому адресу</p>
            </div>
            <div className="topbar-actions">
              <div className="live-pill"><span className="live-dot" /> LIVE ORBITAL VIEW</div>
              <button className="icon-button" data-testid="button-help" aria-label="О справочнике" onClick={() => setShowGuide(!showGuide)}><CircleHelp size={17} /></button>
              {showGuide && <div className="guide-popover"><strong>Как исследовать</strong><span>Выберите объект, наведите камеру или перетащите карту. Колесо мыши меняет масштаб.</span></div>}
            </div>
          </header>
          <div className="dashboard-grid">
            <section className="instrument-card" aria-label="Визуализация солнечной системы">
              <div className="instrument-head">
                <div><div className="instrument-kicker">Карта навигации · вид сверху</div><div className="instrument-title">Орбитальная плоскость</div></div>
                <div className="instrument-status"><Zap size={12} /> СИМУЛЯЦИЯ АКТИВНА</div>
              </div>
              <OrbitScene selectedId={selectedId} setSelectedId={setSelectedId} zoom={zoom} pan={pan} setPan={setPan} playing={playing} speed={speed} onZoom={(amount) => setZoomClamped(zoom + amount)} />
              <div className="instrument-foot">
                <div className="timecode"><span>ЗЕМНОЙ КАЛЕНДАРЬ&nbsp;&nbsp;</span>{formatDay(day)}</div>
                <div className="playback">
                  <button className="play-button" data-testid="button-toggle-playback" aria-label={playing ? 'Поставить на паузу' : 'Продолжить'} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}</button>
                  <label className="speed-control" htmlFor="speed-slider"><Gauge size={13} /> ×{speed.toFixed(1)} <input id="speed-slider" data-testid="input-speed" type="range" min=".5" max="4" step=".5" value={speed} aria-label="Скорость времени" onChange={(e) => setSpeed(Number(e.target.value))} /></label>
                </div>
              </div>
            </section>
            <div className="detail-column">
              <section className="detail-card" data-testid={`panel-details-${selected.id}`}>
                <div className="detail-top">
                  <div><div className="object-kind">{selected.id === 'sun' ? 'Звезда · G2V' : `Планета · ${selected.id === 'earth' ? 'терра' : 'объект системы'}`}</div><h2 className="detail-title">{selected.name}<small>{selected.latin}</small></h2></div>
                  <div className={`object-orb ${selected.id === 'sun' ? 'sun-orb' : 'planet-orb'}`} style={selected.id === 'sun' ? undefined : { '--planet-gradient': selected.gradient, '--planet-glow': selected.glow } as CSSProperties}>{selected.id === 'sun' ? <Sun size={26} /> : <span style={{ width: selected.radius * .8, height: selected.radius * .8, borderRadius: '50%', background: selected.gradient }} />}</div>
                </div>
                <p className="detail-description">{selected.description}</p>
                <dl className="data-list">
                  <div className="data-row"><dt>Масса</dt><dd>{selected.mass}</dd></div>
                  <div className="data-row"><dt>Диаметр</dt><dd>{selected.diameter}</dd></div>
                  <div className="data-row"><dt>Состав</dt><dd>{selected.composition}</dd></div>
                  <div className="data-row"><dt>До Солнца</dt><dd>{selected.distanceSun}</dd></div>
                  <div className="data-row"><dt>До Земли</dt><dd>{selected.distanceEarth}</dd></div>
                  <div className="data-row"><dt>Орбитальный период</dt><dd>{selected.orbitalPeriod}</dd></div>
                  <div className="data-row"><dt>Период вращения</dt><dd>{selected.rotationPeriod}</dd></div>
                  <div className="data-row"><dt>Температура</dt><dd>{selected.temperature}</dd></div>
                </dl>
                <div className="detail-foot"><span className="selected-status">Выбрано для изучения</span><span>01 / 09</span></div>
              </section>
              <section className="navigator-card">
                <div className="navigator-heading"><div className="section-title">Быстрый выбор</div><div className="section-meta">9 объектов</div></div>
                <div className="planet-nav">
                  {bodies.map((body) => <button key={body.id} className={`planet-chip ${selectedId === body.id ? 'selected' : ''}`} style={{ '--planet-gradient': body.gradient, '--planet-glow': body.glow } as CSSProperties} data-testid={`button-select-${body.id}`} onClick={() => setSelectedId(body.id)}><span className="chip-dot" />{body.name}</button>)}
                </div>
              </section>
            </div>
          </div>
          <div className="bottom-grid">
            <section className="fact-card highlight"><div className="fact-label"><Sparkles size={13} /> Знаете ли вы?</div><h3>Один год — восемь минут</h3><p>Свет Солнца путешествует до Земли 8 минут 20 секунд. А до Нептуна — больше четырёх часов.</p></section>
            <section className="fact-card"><div className="fact-label"><Info size={13} /> Дистанция</div><div className="measurement">149,6 <small>млн км</small></div><p>Среднее расстояние Земли от Солнца</p></section>
            <section className="fact-card"><div className="fact-label"><RotateCcw size={13} /> Камера</div><p>Верните телескоп в исходное положение и начните новый маршрут.</p><button className="reset-button" data-testid="button-reset-view" onClick={reset}><RotateCcw size={12} /> Сбросить вид</button></section>
          </div>
        </main>
      </div>
    </div>
  );
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={new QueryClient()}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;