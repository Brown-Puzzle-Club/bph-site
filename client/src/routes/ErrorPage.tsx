import { ErrorResponse, isRouteErrorResponse, useRouteError } from "react-router-dom";

export const Error404 = ({ statusText }: { statusText: string }) => {
  return (
    <div className="min-h-[90%] flex items-center justify-center">
      <div className="text-center text-muted-foreground text-5xl">
        <h1 className="text-[10rem] pb-20">🔎 ?</h1>
        <h2>
          <b>404:</b> {statusText}
        </h2>
      </div>
    </div>
  );
};

const DefaultError = ({ statusText }: { statusText: string }) => {
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{statusText}</p>
    </div>
  );
};

const UnknownError = () => {
  return (
    <div>
      <h1>An unknown error has occurred</h1>
    </div>
  );
};

export default function ErrorPage() {
  const error = useRouteError();
  if (!isRouteErrorResponse(error)) {
    return <UnknownError />;
  }
  const errorResponse = error as ErrorResponse;

  switch (errorResponse.status) {
    case 404:
      return <Error404 statusText={errorResponse.statusText} />;
    default:
      return <DefaultError statusText={errorResponse.statusText} />;
  }
}
