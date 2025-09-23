import { CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  title: string;
  description?: string;
  completed?: boolean;
  current?: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showConnector?: boolean;
}

export function StepIndicator({ 
  steps, 
  className,
  orientation = 'horizontal',
  showConnector = true 
}: StepIndicatorProps) {
  return (
    <div className={cn(
      "flex",
      orientation === 'horizontal' ? "flex-row items-center" : "flex-col",
      className
    )}>
      {steps.map((step, index) => (
        <div key={index} className={cn(
          "flex items-center",
          orientation === 'vertical' && "mb-4 last:mb-0"
        )}>
          {/* Step Circle */}
          <div className={cn(
            "flex items-center justify-center rounded-full border-2 transition-all duration-200",
            orientation === 'horizontal' ? "w-8 h-8" : "w-10 h-10",
            step.completed
              ? "bg-primary border-primary text-primary-foreground"
              : step.current
              ? "bg-primary/10 border-primary text-primary"
              : "bg-background border-muted-foreground/30 text-muted-foreground"
          )}>
            {step.completed ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Circle className={cn(
                "w-3 h-3",
                step.current && "fill-current"
              )} />
            )}
          </div>

          {/* Step Content */}
          <div className={cn(
            "ml-3 flex-1",
            orientation === 'vertical' && "min-w-0"
          )}>
            <div className={cn(
              "font-medium text-sm",
              step.completed
                ? "text-primary"
                : step.current
                ? "text-foreground"
                : "text-muted-foreground"
            )}>
              {step.title}
            </div>
            {step.description && (
              <div className={cn(
                "text-xs mt-1",
                step.completed || step.current
                  ? "text-muted-foreground"
                  : "text-muted-foreground/70"
              )}>
                {step.description}
              </div>
            )}
          </div>

          {/* Connector */}
          {showConnector && index < steps.length - 1 && (
            <div className={cn(
              orientation === 'horizontal'
                ? "mx-4 h-px w-12 bg-border"
                : "ml-4 mt-2 w-px h-6 bg-border"
            )} />
          )}

          {/* Arrow for horizontal layout */}
          {orientation === 'horizontal' && index < steps.length - 1 && showConnector && (
            <ArrowRight className="w-4 h-4 text-muted-foreground/50 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}

// Convenience component for common booking steps
export function BookingSteps({ currentStep }: { currentStep: number }) {
  const steps = [
    {
      title: 'Select Doctor',
      description: 'Choose your preferred doctor',
      completed: currentStep > 0,
      current: currentStep === 0
    },
    {
      title: 'Pick Date & Time',
      description: 'Choose available slot',
      completed: currentStep > 1,
      current: currentStep === 1
    },
    {
      title: 'Add Details',
      description: 'Provide appointment notes',
      completed: currentStep > 2,
      current: currentStep === 2
    },
    {
      title: 'Confirm',
      description: 'Review and confirm booking',
      completed: currentStep > 3,
      current: currentStep === 3
    }
  ];

  return (
    <StepIndicator 
      steps={steps} 
      className="mb-6 p-4 bg-muted/30 rounded-lg"
      orientation="horizontal"
    />
  );
}