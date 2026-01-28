export default function layout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col">{children}</div>;
}
