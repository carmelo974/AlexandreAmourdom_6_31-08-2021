//package http de node.js pour avoir les outils pour créer le serveur
const http = require("http");
const app = require("./app"); // import de app.js
const cors = require("cors");
app.use(cors());

//paramètre du port
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// fonction normalizePort renvoie un port valide 
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
// errorHandler recherche les erreurs et les gère pour enregistrment dans le server
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// const server pour les appels requete et response
const server = http.createServer(app);
// server.on gère les erreurs si besoin
server.on("error", errorHandler); 
// écouteur d'évènement qui consigne le port ou le canal sur lequel le server s'exécute dans la console
server.on("listening", () => { 
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
