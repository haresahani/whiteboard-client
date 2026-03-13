import WhiteboardCanvas from "./canvas/WhiteboardCanvas";
import Toolbar from "./toolbar/Toolbar";

export default function WhiteboardPage() {
  return (
    <div className="w-screen h-screen bg-gray-900 relative">

      <div className="absolute top-4 left-4 z-10">
        <Toolbar />
      </div>

      <WhiteboardCanvas />

    </div>
  );
}