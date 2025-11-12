export function Nav() {
  return (
    <div className="flex justify-between items-center p-4 bg-brown-500 text-white">
      <div className="text-2xl font-bold">Smoethie Vibes</div>
      <div className="flex space-x-4">
        <div className="hover:underline">Home</div>
        <div className="hover:underline">About</div>
        <div className="hover:underline">Contact</div>
      </div>
    </div>
  );
}