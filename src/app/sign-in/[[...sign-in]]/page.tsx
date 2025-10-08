import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative h-screen w-screen bg-[url('https://i.pinimg.com/1200x/bd/f4/59/bdf4599242715d396418687aaff8433b.jpg')] bg-cover bg-center justify-center flex items-center">
      <div className="absolute inset-0 bg-black/65"></div>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-none"></div>
      <SignIn />
    </div>
  );
}
