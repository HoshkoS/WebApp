import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Root, { TaskListType } from "./components/Main/mainComponent";
import ErrorPage from "./error-page";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import UserForm, { userFormType } from './components/UserForm/userFormComponent';
import ProtectedWrap from './components/ProtectedWrap/protectedWrapComponent';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedWrap>
      <Root listType={TaskListType.current}/>
    </ProtectedWrap>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/finished",
    element: <ProtectedWrap>
      <Root listType={TaskListType.finished}/>
    </ProtectedWrap>,
  },
  {
    path: "/login",
    element: <UserForm formType={userFormType.login} />,
  },
  {
    path: "register",
    element: <UserForm formType={userFormType.register} />
  }
]);

export const NginxURL = "https://localhost:443";
export const GeneralURL = "https://localhost:7267";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
