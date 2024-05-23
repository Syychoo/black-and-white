import path from "path";
import express from "express";
import Jimp from "jimp";
import { v4 } from "uuid";

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = import.meta.dirname;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/process", (req, res) => {
  try {
    const { imageURL } = req.body;

    if (imageURL) {
      Jimp.read(imageURL, (err, image) => {
        if (err) {
          throw err;
        }

        image.grayscale();

        image.resize(350, Jimp.AUTO);

        const imageName = `${v4()}.jpg`;

        image.write(`public/images/${imageName}`);
        res.redirect(`/images/${imageName}`);
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`);
});
