const LoadingIndicator = ({
  w,
  ws,
  d,
}: {
  w: number;
  ws?: number;
  d: number;
}) => (
  <div className="flex items-center justify-center">
    <div className={`flex w-${ws} sm:w-${w} items-center justify-center`}>
      <div
        className={`h-${d} w-${d} animate-spin rounded-full border-b-4 border-blue-600`}
      ></div>
    </div>
  </div>
);

export default LoadingIndicator;
