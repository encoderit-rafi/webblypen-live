type ErrorTextProps = {
  text: string;
};
export default function ErrorText({ text = "" }: ErrorTextProps) {
  return (
    <p className="text-destructive text-xs" role="alert" aria-live="polite">
      {text}
    </p>
  );
}
