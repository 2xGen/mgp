import Image from 'next/image';

export function Logo(props: { className?: string }) {
  return (
    <Image
      src="https://soaacpusdhyxwucjhhpy.supabase.co/storage/v1/object/public/MGP/MGP%20logo120px.png"
      alt="MyGoProfile Logo"
      width={24}
      height={24}
      className={props.className || "h-6 w-6"}
    />
  );
}
