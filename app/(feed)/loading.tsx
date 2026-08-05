export default function HomeLoading() {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-4" aria-busy="true">
      <div className="skel h-[16px] w-[120px] mb-3" />
      <div className="flex gap-2.5 mb-8 overflow-hidden">
        <div className="skel shrink-0 aspect-[3/4] w-[min(78vw,300px)]" />
        <div className="skel shrink-0 aspect-[3/4] w-[min(78vw,300px)]" />
        <div className="skel shrink-0 aspect-[3/4] w-[min(78vw,300px)]" />
      </div>
      <div className="skel h-[16px] w-[90px] mb-3" />
      <div className="masonry">
        <div className="mcol">
          {[220, 300, 250, 260].map((h, i) => (
            <div key={i} className="skel" style={{ height: h }} />
          ))}
        </div>
        <div className="mcol">
          {[320, 210, 280, 230].map((h, i) => (
            <div key={i} className="skel" style={{ height: h }} />
          ))}
        </div>
      </div>
    </main>
  );
}
