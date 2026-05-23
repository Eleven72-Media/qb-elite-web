import Image from "next/image";

/**
 * Auth shell — matches Flutter login screen: top half is the brand
 * image (img_bg-login.png), bottom is a white card with the rounded
 * QB Elite logo sitting on its top edge.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white">
      <div className="absolute inset-x-0 top-0 h-[40vh] min-h-[260px] max-h-[420px]">
        <Image
          src="/img_bg-login.png"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-white" />
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
