export default function CategoryLoading() {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-4" aria-busy="true">
      <div className="skel h-[20px] w-[120px] mb-4" />
      <div className="masonry">
        <div className="mcol">
          {[260, 320, 240, 300].map((h, i) => (
            <div key={i} className="skel" style={{ height: h }} />
          ))}
        </div>
        <div className="mcol">
          {[220, 280, 250, 310].map((h, i) => (
            <div key={i} className="skel" style={{ height: h }} />
          ))}
        </div>
      </div>
    </main>
  );
}
