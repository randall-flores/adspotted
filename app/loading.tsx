export default function HomeLoading() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-4" aria-busy="true">
      <div className="flex gap-5 mb-6 overflow-hidden">
        {[56, 72, 60, 64, 52, 68].map((w, i) => (
          <div key={i} className="skel h-[18px] shrink-0" style={{ width: w }} />
        ))}
      </div>
      <div className="skel h-[16px] w-[120px] mb-3" />
      <div className="flex gap-2.5 mb-8 overflow-hidden">
        <div className="skel shrink-0 aspect-[3/4] w-[min(78vw,300px)]" />
        <div className="skel shrink-0 aspect-[3/4] w-[min(78vw,300px)]" />
        <div className="skel shrink-0 aspect-[3/4] w-[min(78vw,300px)]" />
      </div>
      <div className="skel h-[16px] w-[90px] mb-3" />
      <div className="masonry">
        {[220, 300, 250, 320, 210, 280, 260, 230].map((h, i) => (
          <div key={i} className="skel" style={{ height: h }} />
        ))}
      </div>
    </main>
  );
}
