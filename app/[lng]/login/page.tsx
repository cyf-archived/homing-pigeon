export default function Login({
  params,
}: {
  params: {
    lng: string;
  };
}) {
  return (
    <>
      <div className="min-h-[calc(100vh-8rem)] w-full max-w-screen-xl flex-1 px-5 xl:px-0">
        <div className="h-[100%] w-full">Login page</div>
      </div>
    </>
  );
}
