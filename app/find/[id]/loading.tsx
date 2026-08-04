export default function FindLoading() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-4" aria-busy="true">
      <div className="skel h-[34px] w-[76px] rounded-full mb-3" />
      <div className="skel aspect-[4/5] w-full !rounded-2xl" />
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="skel h-[24px] w-[55%] mb-2" />
          <div className="skel h-[16px] w-[70%] mb-3" />
          <div className="skel h-[12px] w-[80px]" />
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="skel h-[42px] w-[92px]" />
          <div className="skel h-[34px] w-[84px] rounded-full" />
        </div>
      </div>
    </main>
  );
}
