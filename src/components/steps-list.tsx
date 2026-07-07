export type Step = { title: string; description: string };

export function StepsList({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="relative rounded-lg border border-border bg-card p-6 shadow-sm"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-sans font-bold text-secondary-foreground">
            {i + 1}
          </span>
          <h3 className="mt-4 font-sans font-bold text-lg text-primary">{step.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
