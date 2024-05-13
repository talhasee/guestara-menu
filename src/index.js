import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8000;
        app.listen(PORT, () => {
            console.log(`Server is listening on PORT ${PORT}`);
        })
    })
    .catch((err) => {
        console.log(`MongoDB db connection failed!!! ${err}`);
    })