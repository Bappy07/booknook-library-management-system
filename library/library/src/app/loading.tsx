
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8E2D6] border-t-[#173D32]" />

        <p className="mt-4 text-sm text-[#777D74]">
          Loading BookNook...
        </p>
      </div>
    </div>
  );
}
