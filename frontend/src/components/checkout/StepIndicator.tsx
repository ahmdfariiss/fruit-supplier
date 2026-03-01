interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-10">
      {steps.map((step, idx) => {
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  text-sm font-bold transition-all duration-300
                  ${
                    isCompleted
                      ? 'bg-g1 text-white'
                      : isActive
                        ? 'bg-g1 text-white shadow-[0_0_0_4px_rgba(45,90,0,0.15)]'
                        : 'bg-g6 text-muted border border-faint'
                  }
                `}
              >
                {isCompleted ? '✓' : step.number}
              </div>
              <span
                className={`text-xs font-semibold whitespace-nowrap ${
                  isActive || isCompleted ? 'text-g1' : 'text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <div className="flex-1 mx-3 mt-[-24px]">
                <div
                  className={`h-0.5 rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-g3' : 'bg-faint'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
