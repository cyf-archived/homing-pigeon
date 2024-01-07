export default function Admin({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  return (
    <>
      <div className="min-h-[calc(100vh-8rem)] w-full max-w-screen-xl flex-1 px-5 xl:px-0">
        <div className="h-[2000px] w-full">Admin Page</div>
      </div>
    </>
  );
}
