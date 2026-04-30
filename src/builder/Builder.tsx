import { Navigate } from "react-router-dom";

// Legacy route — redirect to the new Builder home
const Builder = () => <Navigate to="/builder" replace />;

export default Builder;
