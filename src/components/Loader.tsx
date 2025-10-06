import React from "react";
import { Spinner } from "./ui/spinner";

const Loader = () => {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="text-center flex  justify-center items-center gap-4 flex-col">
        <Spinner className="h-[10vh] w-[10vh]" />
        <p className="text-muted-foreground font-light">
          Loading your achievements...
        </p>
      </div>
    </div>
  );
};

export default Loader;
