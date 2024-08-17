import { Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import React from "react"

export function DialogDeleteForm({ title, onDelete }: {
  title: string,
  onDelete: () => Promise<void>
}) {
  const [open, setOpen] = React.useState(false)

  const handleDelete = React.useCallback(async () => {
    try {
      await onDelete()
      setOpen(false)
    } catch (e) { }

  }, [onDelete])

  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
      <Button variant="ghost"> <Trash2 className="h-4 w-4" /> </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle> {title} </DialogTitle>
        <DialogDescription>This action cannot be undone.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleDelete} variant="destructive">Delete</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}
