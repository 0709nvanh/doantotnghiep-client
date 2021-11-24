import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LayoutAdmin from "./layouts/layoutAdmin";
import LayoutWebsite from "./layouts/layoutWebSite";
import Addauthor from "./pages/admin/author/addauthor";
import Author from "./pages/admin/author/author";

type Props = {

};

const Router: React.FC<Props> = (props) => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LayoutWebsite />}>
          <Route index element={<div>Home Page</div>} />
          <Route path="products" element={<div />} />
        </Route>

        <Route path="admin/*" element={<LayoutAdmin />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<div>Admin Dashboard</div>} />
          <Route path="authors" element={<Author />} />
          <Route path="addauthor" element={<Addauthor />} />
        </Route>
      </Routes>
    </div>
  );
};
export default Router;
