import { toast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import React from "react";

export function useOnErrorToast() {
  const onError = React.useCallback((error: Error) => {
    if (!(error instanceof AxiosError) || !error.response || error.response.status !== 409) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An unknown error has occured"
      })
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Conflicting data already exists."
      })
    }
  }, [])

  return onError
}

export function useOnSuccessToast() {
  return React.useCallback((desc?: string) => {
    toast({
      title: "Success!",
      description: desc,
      duration: 5000
    })
  }, [])
}
