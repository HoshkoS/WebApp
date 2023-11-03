import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Root, { TaskListType } from "./components/Main/mainComponent";
import ErrorPage from "./error-page";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { Provider } from 'react-redux';
import store, { persistor } from './stores/userStore';
import { PersistGate } from 'redux-persist/integration/react';
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

export const URL = "http://localhost:80";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode >
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
