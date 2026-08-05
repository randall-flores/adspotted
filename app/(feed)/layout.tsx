import CategoryTabs from "../components/CategoryTabs";

/** Shared shell for the home feed and category pages: the tab row lives
 *  here so it never unmounts while switching tabs — only the content
 *  below swaps (and shows its own skeleton while streaming in). */
export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto max-w-7xl px-5 pt-4">
        <CategoryTabs />
      </div>
      {children}
    </>
  );
}
