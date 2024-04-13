import type { ErrorResponse } from "react-router-dom";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const DefaultError = ({ error }: { error: ErrorResponse }) => {
  window.location.href = "/eventpage";
  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="text-center text-muted-foreground text-5xl">
        <h1 className="text-[10rem] pb-20">🔎 ?</h1>
        <h2>
          <b>{error.status}:</b> {error.statusText}
        </h2>
      </div>
    </div>
  );
};

const UnknownError = () => {
  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="text-center text-muted-foreground text-5xl">
        <h1 className="text-[10rem] pb-20">🔎 ?</h1>
        <h2>
          <b>Unknown Error</b>
        </h2>
      </div>
    </div>
  );
};

export default function ErrorPage({ custom_error }: { custom_error?: ErrorResponse }) {
  // window.location.href = "/eventpage";
  // RouteError comes from react router. It labels error pages as 404 etc.
  const error = useRouteError();
  if (!custom_error) {
    if (!isRouteErrorResponse(error)) {
      return <UnknownError />;
    }
    const error_response = error as ErrorResponse;
    return <DefaultError error={error_response} />;
  }

  return <DefaultError error={custom_error} />;
}

export const Error404 = () => {
  return (
    <DefaultError
      error={{
        status: 404,
        statusText: "Not Found",
        data: {},
      }}
    />
  );
};
