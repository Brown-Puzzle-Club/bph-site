import { ErrorResponse, isRouteErrorResponse, useRouteError } from "react-router-dom";

const Error404 = ({ error }: { error: ErrorResponse }) => {
  return (
    <div className="min-h-[90%] flex items-center justify-center">
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
    <div>
      <h1>Something went wrong</h1>
      <p>{error.statusText}</p>
    </div>
  );
};

const UnknownError = () => {
  return (
    <div>
      <h1>An unknown error has occured</h1>
    </div>
  );
};

export default function ErrorPage() {
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
