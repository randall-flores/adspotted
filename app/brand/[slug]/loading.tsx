export default function BrandLoading() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-4" aria-busy="true">
      <div className="skel h-[34px] w-[76px] rounded-full mb-3" />
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="skel h-[11px] w-[48px] mb-2" />
          <div className="skel h-[28px] w-[45%] mb-3" />
          <div className="skel h-[13px] w-[180px]" />
        </div>
        <div className="skel h-[42px] w-[92px]" />
      </div>
      <div className="masonry">
        {[260, 320, 240, 300, 220, 280].map((h, i) => (
          <div key={i} className="skel" style={{ height: h }} />
        ))}
      </div>
    </main>
  );
}
