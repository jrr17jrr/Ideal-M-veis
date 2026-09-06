import { Container } from "@/components/ui/Container";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Container className="py-12">
      <div className="skeleton mb-8 h-8 w-56 rounded" />
      <ProductGridSkeleton count={8} />
    </Container>
  );
}
