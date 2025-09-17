import { Advocate } from "../types/advocate";
import { AdvocateCard } from "./AdvocateCard";

type AdvocateGridProps = {
  advocates: Advocate[];
  expandedAdvocateId: number | null;
  onToggleSpecialties: (advocateId: number) => void;
};

export function AdvocateGrid({
  advocates,
  expandedAdvocateId,
  onToggleSpecialties,
}: AdvocateGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
      {advocates.map((advocate) => (
        <AdvocateCard
          key={advocate.id}
          advocate={advocate}
          isExpanded={expandedAdvocateId === advocate.id}
          onToggleSpecialties={onToggleSpecialties}
        />
      ))}
    </div>
  );
}
