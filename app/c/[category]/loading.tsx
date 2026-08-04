export default function CategoryLoading() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-4" aria-busy="true">
      <div className="skel h-[34px] w-[76px] rounded-full mb-3" />
      <div className="skel h-[20px] w-[120px] mb-4" />
      <div className="masonry">
        {[260, 320, 240, 300, 220, 280, 250, 310].map((h, i) => (
          <div key={i} className="skel" style={{ height: h }} />
        ))}
      </div>
    </main>
  );
}
