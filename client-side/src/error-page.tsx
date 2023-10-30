import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error:any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>What happened?</h1>
      <p>Sorry, we don't know. But we'll try to figure it out.<br/>
      Please return to previous working page</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
