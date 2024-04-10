import { cloneElement } from "react";
import { BeatLoader } from "react-spinners";

import { useDjangoContext } from "@/hooks/useDjangoContext";
import { Error404 } from "@/routes/ErrorPage";
import type { DjangoContext } from "@/utils/django_types";

// the div inside the children will be locked from view if the hunt has not started
export function Locked({
  condition,
  children,
  ...props
}: {
  condition: (context: DjangoContext) => boolean;
  children: React.ReactElement;
}) {
  const { data: context } = useDjangoContext();

  if (!context?.team_context) {
    // LOADING
    return <BeatLoader className="justify-center content-center p-4" color={"#fff"} size={12} />;
  } else if (context && condition(context)) {
    // PASSES CONDITION
    return <>{cloneElement(children, props)}</>;
  } else {
    // DOES NOT PASS CONDITION
    return <Error404 />;
  }
}
