import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { Loader2, Wand2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import type { GenerateApplicationDialogProps } from "~/lib/models/application.types";

export function GenerateApplicationDialog({
  open,
  onOpenChange,
}: GenerateApplicationDialogProps) {
  const [prompt, setPrompt] = useState("");
  const navigation = useNavigation();
  const isGenerating =
    navigation.state === "submitting" &&
    navigation.formData?.get("intent") === "generate";

  const canGenerate = prompt.trim().length > 0 && !isGenerating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!isGenerating} className="sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Generate Application</DialogTitle>
          <DialogDescription>
            Paste a job listing or describe the position you're applying for.
          </DialogDescription>
        </DialogHeader>

        <Form method="post" action="/dashboard/applications">
          <input type="hidden" name="intent" value="generate" />

          <Textarea
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Frontend Developer at Google, found on LinkedIn..."
            rows={4}
            autoFocus
            disabled={isGenerating}
            className="min-h-28 max-h-[50vh] overflow-y-auto field-sizing-normal"
          />

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <button
              type="submit"
              disabled={!canGenerate}
              className={buttonVariants()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="size-4" />
                  Generate
                </>
              )}
            </button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
