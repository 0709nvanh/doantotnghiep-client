import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import persistor, { store } from "./store";
import "bootstrap/dist/css/bootstrap.css"
// khởi tạo apollo client
const client = new ApolloClient({
	cache: new InMemoryCache(),
	uri: "https://doantotnghiep-server.onrender.com/graphql",
	// uri: "http://localhost:9000/graphql",
});

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter>
					<ApolloProvider client={client}>
						<App />
					</ApolloProvider>
				</BrowserRouter>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);
