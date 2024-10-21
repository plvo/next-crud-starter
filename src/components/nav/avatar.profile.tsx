import { Avatar, AvatarImage } from "../ui/avatar";

export default function AvatarProfile({ image }: { image: string }) {
  return (
    <Avatar className="flex items-center">
      <AvatarImage src={image} />
    </Avatar>
  );
}