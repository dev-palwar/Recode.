import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  title = "Unable to load data",
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="border border-destructive/50 rounded-lg p-6 bg-destructive/10">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-destructive text-xs">!</span>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              {message}
            </p>

            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 text-sm text-foreground hover:text-foreground/80 font-light underline underline-offset-2"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
