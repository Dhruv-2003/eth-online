import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InviteFriend() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite a Friend</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite a Friend</DialogTitle>
          <DialogDescription className="">
            Enter details below to invite your friend on <b>OnBoardr</b> and let them
            kickstart their journey of claiming amazing rewards
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Friend&#39;s Name
            </Label>
            <Input id="name" placeholder="Alice" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="friend@example.com"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Send Invitataion</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
