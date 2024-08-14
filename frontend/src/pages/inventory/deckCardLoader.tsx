import { Skeleton } from "@/components/ui/skeleton";
const DeckCardLoader: React.FC = () => {
  return (
    <>
      <Skeleton className="rounded-sm bg-muted w-[170px] h-[275px] " />
    </>
  );
};

export default DeckCardLoader;
