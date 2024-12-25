import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import { publicRoutes, customerRoutes, doctorRoutes, adminRoutes, defaultLayoutRoutes } from './router/Router'
import DefaultLayout from './components/Layout/DefaultLayout/index';
import { Children, Fragment } from "react";
import PrivateRoute from "./router/PrivateRoute";
function App() {

  return (
    <Router>
      {/* route pubic */}
      <Routes>
        {defaultLayoutRoutes.map((route, index) => {
          // xử lí Layout
          let Layout = DefaultLayout

          if (route.layout) {
            Layout = route.layout
          } else if (route.layout === null) {
            Layout = Fragment
          }

          const Page = route.component
          return (        
            <Route
              key={index}
              path={route.path}
              element={
                route.path == "/error" ? <Page /> :
                <PrivateRoute role={route.role}>
                <Layout>
                  <Page />
                </Layout>
                </PrivateRoute>
                }
            />
          )
        })}
      </Routes>

      {/* route doctor */}
      {/* <Routes>
        {doctorRoutes.map((route, index) => {
          // xử lí Layout
          let Layout = DefaultLayout

          if (route.layout) {
            Layout = route.layout
          } else if (route.layout === null) {
            Layout = Fragment
          }

          const Page = route.component
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>}
            />
          )
        })}
      </Routes> */}
    </Router>
  )
}

export default App
