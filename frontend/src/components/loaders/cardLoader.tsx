import { Skeleton } from "@/components/ui/skeleton";
const CardLoader: React.FC = () => {

  return (
    <>
      <Skeleton className="rounded-sm bg-muted w-[170px] h-[275px]  md:w-[200px]  md:h-[300px] " />
    </>
  );
};

export default CardLoader;
