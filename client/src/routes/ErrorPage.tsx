import { ErrorResponse, isRouteErrorResponse, useRouteError } from "react-router-dom";

const Error404 = ({ error }: { error: ErrorResponse }) => {
  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="text-center text-muted-foreground text-5xl">
        <h1 className="text-[10rem] pb-20">🔎 ?</h1>
        <h2>
          <b>404:</b> {error.statusText}
        </h2>
      </div>
    </div>
  );
};

const DefaultError = ({ error }: { error: ErrorResponse }) => {
  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div className="text-center text-muted-foreground text-5xl">
        <h1 className="text-[10rem] pb-20">🔎 ?</h1>
        <h2>
          <b>Something went wrong:</b> {error.statusText}
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

export default function ErrorPage() {
  // RouteError comes from react router. It labels error pages as 404 etc.
  const error = useRouteError();
  if (!isRouteErrorResponse(error)) {
    return <UnknownError />;
  }
  const error_response = error as ErrorResponse;

  switch (error_response.status) {
    case 404:
      return <Error404 error={error_response} />;
    default:
      return <DefaultError error={error_response} />;
  }
}
