import Image from "next/image";

/**
 * Auth shell — top is the brand-navy ladder (matches qbeliteapp.com
 * landing + qbelite.com marketing), bottom is a white card with the
 * rounded QB Elite logo sitting on its top edge. No photo backdrop
 * any more — pure navy + soft red/blue brand glows.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="absolute inset-x-0 top-0 h-[40vh] min-h-[260px] max-h-[420px] overflow-hidden">
        <div className="absolute inset-0 bg-brand-navyDeep" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navyDeep via-brand-navy to-white" />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 top-1/3 h-[300px] w-[300px] rounded-full bg-primary/22 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-[300px] w-[300px] rounded-full bg-[#0693e3]/18 blur-3xl"
        />
      </div>
      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col px-5 pb-8 pt-[max(env(safe-area-inset-top),1rem)]">
        <div className="flex-1" />
        <div className="relative mb-4 mt-[28vh] flex justify-center">
          <div className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-white p-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            <Image
              src="/logo.png"
              alt="QB Elite"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="-mt-12 rounded-3xl bg-white pb-6 pt-16 shadow-[0_8px_28px_rgba(0,0,0,0.08)]">
          <div className="px-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
